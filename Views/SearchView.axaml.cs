using Avalonia;
using Avalonia.Controls;
using Avalonia.Input;
using Avalonia.Markup.Xaml;
using Adrenalin.ViewModels;
using ReactiveUI;

namespace Adrenalin.Views;

public partial class SearchView : Window
{
	public SearchView()
	{
		InitializeComponent();
	}

	public SearchView(SearchViewModel viewModel) : this()
	{
		DataContext = viewModel;
		viewModel.WhenAnyValue(x => x.IsVisible)
			.Subscribe(visible =>
			{
				if (!visible)
				{
					Close();
				}
			});

		// Auto-focus the search input when opened
		Opened += (s, e) =>
		{
			var textBox = this.FindControl<TextBox>("SearchInput");
			textBox?.Focus();
		};
	}

	private void InitializeComponent()
	{
		AvaloniaXamlLoader.Load(this);
	}
}
