using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using Avalonia.Styling;
using Adrenalin.Views;
using Adrenalin.Services;
using System;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Serilog;

namespace Adrenalin;

public partial class App : Application
{
    private WebServerService? _webServerService;
    private ConfigurationService? _configurationService;

    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
    }

    public override async void OnFrameworkInitializationCompleted()
    {
        // Configure Serilog logging
        var logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "logs", "adrenalin-.log");
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .WriteTo.Console()
            .WriteTo.File(logPath, rollingInterval: RollingInterval.Day)
            .CreateLogger();

        // Initialize configuration service
        _configurationService = new ConfigurationService();

        // Load and apply theme before creating the main window
        LoadAndApplyTheme();

        if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            var service = new GymService(_configurationService);
            await service.InitializeAsync();
            var isInitialized = await service.IsDatabaseInitializedAsync();

            if (isInitialized)
            {
                desktop.MainWindow = new MainWindow(_configurationService!);
            }
            else
            {
                desktop.MainWindow = new SetupView(_configurationService!);
            }

            // Create and start the web server
            _webServerService = new WebServerService();
            desktop.ShutdownRequested += async (sender, e) =>
            {
                if (_webServerService != null)
                {
                    await _webServerService.StopAsync();
                    _webServerService.Dispose();
                }
            };
        }

        // Start the API server in the background
        _ = Task.Run(async () =>
        {
            try
            {
                Log.Information("Starting API server...");
                var gymService = new GymService(_configurationService!);

                // Load API settings from settings.json or use environment variables as fallback
                var apiKey = _configurationService!.GetApiKey();
                var port = _configurationService!.GetApiPort();

                Log.Information("API server configured with port {Port}", port);
                await _webServerService!.StartAsync(gymService, apiKey, port);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Failed to start API server");
            }
        });

        base.OnFrameworkInitializationCompleted();
    }





    private void LoadAndApplyTheme()
    {
        try
        {
            var settings = _configurationService?.LoadSettings();
            if (settings?.Theme != null)
            {
                RequestedThemeVariant = settings.Theme == "Dark" ? ThemeVariant.Dark : ThemeVariant.Light;
            }
        }
        catch
        {
            // Use default theme
        }
    }

    private class SettingsData
    {
        public string? Theme { get; set; }
    }
}
