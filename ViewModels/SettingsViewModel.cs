using ReactiveUI;
using System.Reactive;
using System.Text.Json;
using Avalonia.Styling;
using Avalonia.Controls;
using Avalonia.Platform.Storage;
using Avalonia;
using Adrenalin.Services;
using System.Net;
using System.Linq;

namespace Adrenalin.ViewModels;

public class SettingsViewModel : ReactiveObject
{
	private readonly LocalizationService _localizationService;
	private readonly WebServerService _webServerService;
	private readonly GymService _gymService;
	private readonly ConfigurationService _configurationService;
	private string _selectedTheme = "Light";
	private string _selectedLanguage = "en";
	private string _emailApiKey = string.Empty;
	private string _databasePath = string.Empty;
	private int _apiPort = 8080;
	private bool _isLoading;
	private string _networkAccessInfo = string.Empty;

	public SettingsViewModel(LocalizationService localizationService, WebServerService webServerService, GymService gymService, ConfigurationService configurationService)
	{
		_localizationService = localizationService;
		_webServerService = webServerService;
		_gymService = gymService;
		_configurationService = configurationService;

		// Load saved settings
		LoadSettings();

		// Initialize network access info
		UpdateNetworkAccessInfo();

		SaveSettings = ReactiveCommand.CreateFromTask(SaveSettingsAsync);
		ResetSettings = ReactiveCommand.Create(ResetSettingsExecute);
		BrowseDatabasePath = ReactiveCommand.CreateFromTask(BrowseDatabasePathAsync);

		// Subscribe to language changes
		_localizationService.LanguageChanged += OnLanguageChanged;
	}

	public string SelectedTheme
	{
		get => _selectedTheme;
		set
		{
			this.RaiseAndSetIfChanged(ref _selectedTheme, value);
			ApplyTheme();
		}
	}

	public string SelectedLanguage
	{
		get => _selectedLanguage;
		set
		{
			this.RaiseAndSetIfChanged(ref _selectedLanguage, value);
			_localizationService.SetLanguage(value);
		}
	}

	public string EmailApiKey
	{
		get => _emailApiKey;
		set => this.RaiseAndSetIfChanged(ref _emailApiKey, value);
	}

	public string DatabasePath
	{
		get => _databasePath;
		set => this.RaiseAndSetIfChanged(ref _databasePath, value);
	}

	public int ApiPort
	{
		get => _apiPort;
		set
		{
			this.RaiseAndSetIfChanged(ref _apiPort, value);
			UpdateNetworkAccessInfo();
		}
	}

	public bool IsLoading
	{
		get => _isLoading;
		set => this.RaiseAndSetIfChanged(ref _isLoading, value);
	}

	public string NetworkAccessInfo
	{
		get => _networkAccessInfo;
		private set => this.RaiseAndSetIfChanged(ref _networkAccessInfo, value);
	}

	public ReactiveCommand<Unit, Unit> SaveSettings { get; }
	public ReactiveCommand<Unit, Unit> ResetSettings { get; }
	public ReactiveCommand<Unit, Unit> BrowseDatabasePath { get; }

	// Localized properties
	public string Title => _localizationService.GetString("components.settings.title");
	public string ThemeLabel => _localizationService.GetString("components.settings.theme");
	public string LanguageLabel => _localizationService.GetString("components.settings.language");
	public string EmailApiKeyLabel => _localizationService.GetString("components.settings.emailApiKey");
	public string DatabasePathLabel => _localizationService.GetString("components.settings.databasePath");
	public string ApiPortLabel => _localizationService.GetString("components.settings.apiPort");
	public string NetworkAccessLabel => _localizationService.GetString("components.settings.networkAccess");
	public string NetworkAccessDescription => _localizationService.GetString("components.settings.networkAccessDescription");
	public string NetworkAccessNote => _localizationService.GetString("components.settings.networkAccessNote");
	public string SaveButtonLabel => _localizationService.GetString("buttons.save");
	public string ResetButtonLabel => _localizationService.GetString("buttons.reset");
	public string BrowseButtonLabel => _localizationService.GetString("buttons.browse");
	public string LightThemeLabel => _localizationService.GetString("themes.light");
	public string DarkThemeLabel => _localizationService.GetString("themes.dark");

	public IEnumerable<string> AvailableThemes => new[] { "Light", "Dark" };
	public IEnumerable<string> AvailableLanguages => _localizationService.AvailableLanguages;

	private void LoadSettings()
	{
		try
		{
			var settings = _configurationService.LoadSettings();
			_selectedTheme = settings.Theme ?? "Light";
			_selectedLanguage = settings.Language ?? "en";
			_emailApiKey = settings.EmailApiKey ?? string.Empty;
			_databasePath = settings.DatabasePath ?? string.Empty;
			_apiPort = settings.ApiPort ?? 8080;
		}
		catch
		{
			// Use defaults
		}

		// Apply loaded theme
		ApplyTheme();
	}

	private async Task SaveSettingsAsync()
	{
		IsLoading = true;
		try
		{
			var settings = new SettingsData
			{
				Theme = SelectedTheme,
				Language = SelectedLanguage,
				EmailApiKey = EmailApiKey,
				DatabasePath = DatabasePath,
				ApiPort = ApiPort
			};

			await _configurationService.SaveSettingsAsync(settings);

			// Restart web server if network settings changed
			var apiKey = _configurationService.GetApiKey();
			await _webServerService.RestartAsync(_gymService, apiKey, ApiPort);

			// Update network access info with new port
			UpdateNetworkAccessInfo();
		}
		finally
		{
			IsLoading = false;
		}
	}

	private void ResetSettingsExecute()
	{
		SelectedTheme = "Light";
		SelectedLanguage = "en";
		EmailApiKey = string.Empty;
		DatabasePath = string.Empty;
		ApiPort = 8080;
	}

	private void ApplyTheme()
	{
		var app = Avalonia.Application.Current;
		if (app != null)
		{
			app.RequestedThemeVariant = SelectedTheme == "Dark" ? ThemeVariant.Dark : ThemeVariant.Light;
		}
	}

	private async Task BrowseDatabasePathAsync()
	{
		// Get the current window from the application
		var window = Avalonia.Application.Current?.ApplicationLifetime is Avalonia.Controls.ApplicationLifetimes.IClassicDesktopStyleApplicationLifetime desktop
			? desktop.MainWindow
			: null;

		if (window == null) return;

		try
		{
			var file = await window.StorageProvider.SaveFilePickerAsync(new FilePickerSaveOptions
			{
				Title = "Select Database Location",
				DefaultExtension = "db",
				FileTypeChoices = new[]
				{
					new FilePickerFileType("SQLite Database")
					{
						Patterns = new[] { "*.db" }
					},
					new FilePickerFileType("All Files")
					{
						Patterns = new[] { "*" }
					}
				},
				SuggestedFileName = "adrenalin.db"
			});

			if (file?.Path.LocalPath != null)
			{
				DatabasePath = file.Path.LocalPath;
			}
		}
		catch
		{
			// User cancelled or error occurred
		}
	}

	private void OnLanguageChanged(object? sender, string language)
	{
		// Refresh localized properties
		this.RaisePropertyChanged(nameof(Title));
		this.RaisePropertyChanged(nameof(ThemeLabel));
		this.RaisePropertyChanged(nameof(LanguageLabel));
		this.RaisePropertyChanged(nameof(EmailApiKeyLabel));
		this.RaisePropertyChanged(nameof(DatabasePathLabel));
		this.RaisePropertyChanged(nameof(ApiPortLabel));
		this.RaisePropertyChanged(nameof(NetworkAccessLabel));
		this.RaisePropertyChanged(nameof(NetworkAccessDescription));
		this.RaisePropertyChanged(nameof(NetworkAccessNote));
		this.RaisePropertyChanged(nameof(SaveButtonLabel));
		this.RaisePropertyChanged(nameof(ResetButtonLabel));
		this.RaisePropertyChanged(nameof(BrowseButtonLabel));
		this.RaisePropertyChanged(nameof(LightThemeLabel));
		this.RaisePropertyChanged(nameof(DarkThemeLabel));
	}

	private void UpdateNetworkAccessInfo()
	{
		try
		{
			var host = Dns.GetHostEntry(Dns.GetHostName());
			var localIPs = host.AddressList.Where(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork).ToList();

			List<string> urls;
			if (localIPs.Any())
			{
				urls = localIPs.Select(ip => $"http://{ip}:{ApiPort}").ToList();
			}
			else
			{
				urls = new List<string> { $"http://localhost:{ApiPort}" };
			}
			NetworkAccessInfo = string.Join("\n", urls);
		}
		catch
		{
			NetworkAccessInfo = $"http://localhost:{ApiPort}";
		}
	}




}
