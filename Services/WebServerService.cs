using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using System.Net;
using System.Text.Json;
using System.IO;
using System.Threading;
using System.Reflection;
using Adrenalin.Models;
using Adrenalin.Services;
using Serilog;

namespace Adrenalin.Services;

/// <summary>
/// ASP.NET Core web server service for handling member registration requests.
/// Replaces the custom TCP-based HTTP server with proper ASP.NET Core implementation.
/// </summary>
public class WebServerService : IDisposable
{
	private WebApplication? _app;
	private CancellationTokenSource? _cts;
	private Task? _serverTask;
	private GymService? _gymService;
	private string? _apiKey;
	private int _port;

	/// <summary>
	/// Starts the ASP.NET Core web server.
	/// </summary>
	/// <param name="gymService">The gym service for database operations.</param>
	/// <param name="apiKey">The API key for authentication.</param>
	/// <param name="port">The port to listen on.</param>
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
	public async Task StartAsync(GymService gymService, string apiKey, int port = 8080)
	{
		if (_serverTask != null)
			return; // Already running

		_gymService = gymService;
		_apiKey = apiKey;
		_port = port;
		_cts = new CancellationTokenSource();

		_serverTask = Task.Run(async () => await RunServerAsync(_cts.Token));
	}
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously

	/// <summary>
	/// Stops the web server.
	/// </summary>
	public async Task StopAsync()
	{
		if (_cts != null)
		{
			_cts.Cancel();
			if (_serverTask != null)
			{
				await _serverTask;
			}
			_cts = null;
			_serverTask = null;
		}

		if (_app != null)
		{
			await _app.StopAsync();
			_app = null;
		}
	}

	/// <summary>
	/// Restarts the web server with new configuration.
	/// </summary>
	/// <param name="gymService">The gym service for database operations.</param>
	/// <param name="apiKey">The API key for authentication.</param>
	/// <param name="port">The port to listen on.</param>
	public async Task RestartAsync(GymService gymService, string apiKey, int port)
	{
		await StopAsync();
		await StartAsync(gymService, apiKey, port);
	}

	/// <summary>
	/// Gets the list of network access URLs.
	/// </summary>
	public List<string> GetNetworkUrls()
	{
		try
		{
			var host = Dns.GetHostEntry(Dns.GetHostName());
			var localIPs = host.AddressList.Where(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork).ToList();

			if (localIPs.Any())
			{
				return localIPs.Select(ip => $"http://{ip}:{_port}").ToList();
			}
			else
			{
				return new List<string> { $"http://localhost:{_port}" };
			}
		}
		catch
		{
			return new List<string> { $"http://localhost:{_port}" };
		}
	}

	private async Task RunServerAsync(CancellationToken cancellationToken)
	{
		Log.Information("Web server starting on port {Port} with embedded static files", _port);

		try
		{
			var builder = WebApplication.CreateBuilder();

			// Configure the web host to listen on all interfaces
			builder.WebHost.UseUrls($"http://*:{_port}");

			_app = builder.Build();
			Log.Information("Web application built successfully");
		}
		catch (Exception ex)
		{
			Log.Error(ex, "Failed to build web application");
			throw;
		}

		// Configure embedded file serving
		Log.Information("Configuring embedded file serving");

		_app.Use(async (context, next) =>
		{
			var path = context.Request.Path.Value?.TrimStart('/') ?? "";
			string? resourceName = null;
			var contentType = "text/plain";

			// Map request paths to embedded resources
			switch (path)
			{
				case "":
				case "/":
					resourceName = "Adrenalin.wwwroot.index.html";
					contentType = "text/html";
					break;
				case "styles.css":
					resourceName = "Adrenalin.wwwroot.styles.css";
					contentType = "text/css";
					break;
				case "script.js":
					resourceName = "Adrenalin.wwwroot.script.js";
					contentType = "application/javascript";
					break;
			}

			if (resourceName != null)
			{
				try
				{
					var assembly = Assembly.GetExecutingAssembly();
					using var stream = assembly.GetManifestResourceStream(resourceName);
					if (stream != null)
					{
						context.Response.ContentType = contentType;

						if (contentType == "text/html")
						{
							// Inject API key for HTML files
							using var reader = new StreamReader(stream);
							var htmlContent = await reader.ReadToEndAsync();
							var apiKeyScript = $"<script>window.API_KEY = '{_apiKey!}';</script>";
							htmlContent = htmlContent.Replace("</head>", $"{apiKeyScript}</head>", StringComparison.OrdinalIgnoreCase);
							await context.Response.WriteAsync(htmlContent);
						}
						else
						{
							await stream.CopyToAsync(context.Response.Body);
						}
						return;
					}
					else
					{
						Log.Warning("Embedded resource not found: {ResourceName}", resourceName);
					}
				}
				catch (Exception ex)
				{
					Log.Error(ex, "Failed to serve embedded resource: {ResourceName}", resourceName);
				}
			}

			await next();
		});

		// Simple health check endpoint
		_app.MapGet("/health", () => "OK");

		// API endpoint for member registration
		_app.MapPost("/api/members", async (HttpContext context) =>
		{
			try
			{
				// Check authentication
				if (!context.Request.Headers.TryGetValue("Authorization", out var authHeader) ||
					!authHeader.ToString().StartsWith("Bearer "))
				{
					context.Response.StatusCode = StatusCodes.Status401Unauthorized;
					await context.Response.WriteAsJsonAsync(new { error = "Missing or invalid authorization header" });
					return;
				}

				var providedKey = authHeader.ToString().Substring("Bearer ".Length);
				if (providedKey != _apiKey!)
				{
					context.Response.StatusCode = StatusCodes.Status401Unauthorized;
					await context.Response.WriteAsJsonAsync(new { error = "Invalid API key" });
					return;
				}

				// Read and deserialize request body
				var member = await context.Request.ReadFromJsonAsync<Member>();
				if (member == null)
				{
					context.Response.StatusCode = StatusCodes.Status400BadRequest;
					await context.Response.WriteAsJsonAsync(new { error = "Invalid JSON data" });
					return;
				}

				// Set timestamps
				member.CreatedAt = DateTime.Now;
				member.UpdatedAt = DateTime.Now;

				// Validate member data
				var validationError = Member.ValidateForRegistration(member);
				if (!string.IsNullOrEmpty(validationError))
				{
					context.Response.StatusCode = StatusCodes.Status400BadRequest;
					await context.Response.WriteAsJsonAsync(new { error = "Validation failed", details = validationError });
					return;
				}

				// Check for duplicate card ID
				var existingMember = await _gymService!.GetMemberByCardIdAsync(member.CardId);
				if (existingMember != null)
				{
					context.Response.StatusCode = StatusCodes.Status409Conflict;
					await context.Response.WriteAsJsonAsync(new { error = "Member with this card ID already exists", existingId = existingMember.Id });
					return;
				}

				// Add member to database
				var memberId = await _gymService!.AddMemberAsync(member);

				context.Response.StatusCode = StatusCodes.Status201Created;
				await context.Response.WriteAsJsonAsync(new { id = memberId, message = "Member registered successfully" });
			}
			catch (Exception ex)
			{
				context.Response.StatusCode = StatusCodes.Status500InternalServerError;
				await context.Response.WriteAsJsonAsync(new { error = "Internal server error", details = ex.Message });
			}
		});

		// Display network info
		DisplayNetworkInfo(_port);

		try
		{
			// Start the server
			Log.Information("Starting web server...");
			await _app.StartAsync();
			Log.Information("Web server started successfully on port {Port}", _port);
		}
		catch (Exception ex)
		{
			Log.Error(ex, "Failed to start web server");
			throw;
		}

		try
		{
			// Wait indefinitely until cancelled
			await Task.Delay(Timeout.Infinite, cancellationToken);
		}
		catch (TaskCanceledException)
		{
			// Shutdown requested
			Log.Information("Web server shutdown requested");
		}
		finally
		{
			// Stop the server
			if (_app != null)
			{
				Log.Information("Stopping web server...");
				await _app.StopAsync();
				Log.Information("Web server stopped");
			}
		}
	}

	private static void DisplayNetworkInfo(int port)
	{
		try
		{
			Log.Information("=== Mobile Registration Access ===");
			Log.Information("The web registration interface is now available at:");

			// Get all network interfaces
			var host = Dns.GetHostEntry(Dns.GetHostName());
			var localIPs = host.AddressList.Where(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork).ToList();

			if (localIPs.Any())
			{
				foreach (var ip in localIPs)
				{
					Log.Information("  http://{Ip}:{Port}", ip, port);
				}
			}
			else
			{
				Log.Information("  http://localhost:{Port}", port);
			}

			Log.Information("Share any of these URLs with users to access the mobile registration form.");
			Log.Information("Make sure your firewall allows connections on port {Port}.", port);
		}
		catch (Exception ex)
		{
			Log.Warning(ex, "Could not determine network interfaces");
			Log.Information("Web interface should be available at: http://localhost:{Port}", port);
		}
	}

	private static string GetContentType(string path)
	{
		var extension = Path.GetExtension(path).ToLowerInvariant();
		return extension switch
		{
			".html" => "text/html",
			".css" => "text/css",
			".js" => "application/javascript",
			".json" => "application/json",
			".png" => "image/png",
			".jpg" => "image/jpeg",
			".jpeg" => "image/jpeg",
			".gif" => "image/gif",
			".svg" => "image/svg+xml",
			_ => "application/octet-stream"
		};
	}

	public void Dispose()
	{
		_cts?.Cancel();
		_cts?.Dispose();
		// WebApplication doesn't implement IDisposable, so no need to dispose _app
	}
}
