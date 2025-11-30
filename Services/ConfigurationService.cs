using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace Adrenalin.Services;

/// <summary>
/// Service for managing application configuration settings.
/// Handles loading, saving, and providing access to settings stored in settings.json.
/// </summary>
public class ConfigurationService
{
	private readonly string _settingsPath;

	public ConfigurationService()
	{
		_settingsPath = GetSettingsPath();
	}

	/// <summary>
	/// Gets the path to the settings.json file.
	/// </summary>
	public string GetSettingsPath()
	{
		var userDir = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
		var configDir = Path.Combine(userDir, ".adrenalin");
		return Path.Combine(configDir, "settings.json");
	}

	/// <summary>
	/// Loads settings from the settings.json file.
	/// </summary>
	public SettingsData LoadSettings()
	{
		try
		{
			if (File.Exists(_settingsPath))
			{
				var json = File.ReadAllText(_settingsPath);
				var settings = JsonSerializer.Deserialize<SettingsData>(json);
				return settings ?? new SettingsData();
			}
		}
		catch
		{
			// Fall back to defaults
		}
		return new SettingsData();
	}

	/// <summary>
	/// Saves settings to the settings.json file.
	/// </summary>
	public async Task SaveSettingsAsync(SettingsData settings)
	{
		var json = JsonSerializer.Serialize(settings, new JsonSerializerOptions { WriteIndented = true });
		Directory.CreateDirectory(Path.GetDirectoryName(_settingsPath)!);
		await File.WriteAllTextAsync(_settingsPath, json);
	}

	/// <summary>
	/// Gets the database path from settings or environment variable.
	/// </summary>
	public string GetDatabasePath()
	{
		// First check environment variable
		var envPath = Environment.GetEnvironmentVariable("ADRENALIN_DB_PATH");
		if (!string.IsNullOrEmpty(envPath))
		{
			return envPath;
		}

		// Then check settings.json
		var settings = LoadSettings();
		if (!string.IsNullOrEmpty(settings.DatabasePath))
		{
			return settings.DatabasePath;
		}

		// Default path
		return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".adrenalin", "adrenalin.db");
	}

	/// <summary>
	/// Gets the API key from settings or environment variable.
	/// Generates a new key if none exists.
	/// </summary>
	public string GetApiKey()
	{
		// First check environment variable
		var envKey = Environment.GetEnvironmentVariable("ADRENALIN_API_KEY");
		if (!string.IsNullOrEmpty(envKey))
			return envKey;

		// Then check settings.json
		var settings = LoadSettings();
		if (!string.IsNullOrEmpty(settings.ApiKey))
			return settings.ApiKey;

		// Generate a new secure API key
		var newApiKey = Guid.NewGuid().ToString("N");
		settings.ApiKey = newApiKey;
		_ = SaveSettingsAsync(settings); // Fire and forget
		return newApiKey;
	}

	/// <summary>
	/// Gets the API port from settings or environment variable.
	/// </summary>
	public int GetApiPort()
	{
		// First check environment variable
		var envPort = Environment.GetEnvironmentVariable("ADRENALIN_API_PORT");
		if (int.TryParse(envPort, out int port))
			return port;

		// Then check settings.json
		var settings = LoadSettings();
		return settings.ApiPort ?? 8080;
	}
}

/// <summary>
/// Data model for application settings.
/// </summary>
public class SettingsData
{
	public string? Theme { get; set; }
	public string? Language { get; set; }
	public string? EmailApiKey { get; set; }
	public string? DatabasePath { get; set; }
	public int? ApiPort { get; set; }
	public string? ApiKey { get; set; }
}
