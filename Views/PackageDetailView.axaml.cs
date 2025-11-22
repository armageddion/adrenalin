using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Adrenalin.ViewModels;

namespace Adrenalin.Views;

public partial class PackageDetailView : UserControl
{
    public PackageDetailView()
    {
        InitializeComponent();
    }

    private void InitializeComponent()
    {
        AvaloniaXamlLoader.Load(this);
    }
}