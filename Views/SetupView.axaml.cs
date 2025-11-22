using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Adrenalin.Services;
using Adrenalin.ViewModels;

namespace Adrenalin.Views;

public partial class SetupView : Window
{
    public SetupView(ConfigurationService configurationService)
    {
        InitializeComponent();
        var service = new GymService(configurationService);
        var vm = new SetupViewModel(service, this, configurationService);
        DataContext = vm;
    }

    private void InitializeComponent()
    {
        AvaloniaXamlLoader.Load(this);
    }
}