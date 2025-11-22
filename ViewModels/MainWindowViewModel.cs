using ReactiveUI;
using System.Reactive;
using Adrenalin.Services;
using Adrenalin.Views;
using Avalonia.Controls;
using Avalonia;
using System.Reactive.Linq;

namespace Adrenalin.ViewModels;

public class MainWindowViewModel : ReactiveObject
{
    private readonly GymService _service;
    private readonly LocalizationService _localizationService;
    private readonly WebServerService _webServerService;
    private readonly ConfigurationService _configurationService;
    private readonly BarcodeScannerService _barcodeScannerService;
    private int _selectedTabIndex;

    public MainWindowViewModel(GymService service, LocalizationService localizationService, WebServerService webServerService, ConfigurationService configurationService)
    {
        _service = service;
        _localizationService = localizationService;
        _webServerService = webServerService;
        _configurationService = configurationService;
        _barcodeScannerService = new BarcodeScannerService(_service);

        // Initialize ViewModels
        DashboardViewModel = new DashboardViewModel(_service, _localizationService);
        MembersViewModel = new MembersViewModel(_service, _localizationService);
        VisitsViewModel = new VisitsViewModel(_service, _localizationService);
        PackagesViewModel = new PackagesViewModel(_service, _localizationService);
        SettingsViewModel = new SettingsViewModel(_localizationService, _webServerService, _service, _configurationService);
        RegisterViewModel = new RegisterViewModel(_service, _localizationService, NavigateToMember);
        SearchViewModel = new SearchViewModel(_service, _localizationService, this);

        ShowSearchCommand = ReactiveCommand.Create(ShowSearch);

        // Subscribe to barcode visit logged messages
        MessageBus.Current.Listen<(string, int)>("BarcodeVisitLogged")
            .Subscribe(tuple => NavigateToMember(tuple.Item2));

        // Set initial tab
        SelectedTabIndex = 0;
    }

    public DashboardViewModel DashboardViewModel { get; }
    public MembersViewModel MembersViewModel { get; }
    public VisitsViewModel VisitsViewModel { get; }
    public PackagesViewModel PackagesViewModel { get; }
    public SettingsViewModel SettingsViewModel { get; }
    public RegisterViewModel RegisterViewModel { get; }
    public SearchViewModel SearchViewModel { get; }
    public ReactiveCommand<Unit, Unit> ShowSearchCommand { get; }

    // Localized properties
    public string HomeTabLabel => _localizationService.GetString("components.dashboard.title");
    public string MembersTabLabel => _localizationService.GetString("components.members.title");
    public string VisitsTabLabel => _localizationService.GetString("components.visits.title");
    public string PackagesTabLabel => _localizationService.GetString("components.packageList.title");
    public string RegisterTabLabel => _localizationService.GetString("register.title");
    public string SettingsTabLabel => _localizationService.GetString("components.settings.title");

    public int SelectedTabIndex
    {
        get => _selectedTabIndex;
        set => this.RaiseAndSetIfChanged(ref _selectedTabIndex, value);
    }

    public void NavigateToMember(int memberId)
    {
        // Switch to Members tab (index 1)
        SelectedTabIndex = 1;
        // Navigate to member detail
        MembersViewModel.NavigateToMember(memberId);
    }

    public void HandleBarcodeInput(char digit)
    {
        _barcodeScannerService.AddDigit(digit);
    }

    private void ShowSearch()
    {
        SearchViewModel.Show();
        var searchWindow = new SearchView(SearchViewModel);

        // Set the main window as owner
        if (Application.Current?.ApplicationLifetime is Avalonia.Controls.ApplicationLifetimes.IClassicDesktopStyleApplicationLifetime desktop &&
            desktop.MainWindow != null)
        {
            searchWindow.Show(desktop.MainWindow);
        }
        else
        {
            searchWindow.Show();
        }
    }


}