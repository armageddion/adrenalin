using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Avalonia.Input;
using ReactiveUI;
using System.Reactive.Linq;
using Adrenalin.Services;
using Adrenalin.ViewModels;

namespace Adrenalin.Views;

public partial class MainWindow : Window
{
    private MainWindowViewModel? _viewModel;

    public MainWindow(ConfigurationService configurationService)
    {
        InitializeComponent();
        KeyDown += OnKeyDown;

        var localizationService = new LocalizationService();
        var service = new GymService(configurationService);
        var webServerService = new WebServerService();
        var vm = new MainWindowViewModel(service, localizationService, webServerService, configurationService);
        _viewModel = vm;
        DataContext = vm;

        // Load initial data for dashboard
        vm.DashboardViewModel.LoadStats.Execute().ObserveOn(RxApp.MainThreadScheduler).Subscribe();
    }

    private void OnKeyDown(object? sender, KeyEventArgs e)
    {
        // Check if any input field is focused
#pragma warning disable CS8602 // Dereference of a possibly null reference
        var focusedElement = FocusManager.GetFocusedElement();
#pragma warning restore CS8602
        if (focusedElement != null && (focusedElement is TextBox || focusedElement is TextBlock || focusedElement is NumericUpDown))
        {
            // Don't handle if input is focused
            return;
        }

        char? digit = null;
        if (e.Key >= Key.D0 && e.Key <= Key.D9)
        {
            digit = (char)('0' + (e.Key - Key.D0));
        }
        else if (e.Key >= Key.NumPad0 && e.Key <= Key.NumPad9)
        {
            digit = (char)('0' + (e.Key - Key.NumPad0));
        }

        if (digit.HasValue)
        {
            _viewModel?.HandleBarcodeInput(digit.Value);
            e.Handled = true; // Prevent further processing
        }
    }
}
