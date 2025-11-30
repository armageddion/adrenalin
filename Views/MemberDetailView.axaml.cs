using Avalonia.Controls;
using Avalonia.Controls.Primitives;
using Avalonia.Input;

namespace Adrenalin.Views
{
	public partial class MemberDetailView : UserControl
	{
		public MemberDetailView()
		{
			InitializeComponent();
		}

		private void OnPopupOpened(object? sender, EventArgs e)
		{
			if (sender is Popup popup && popup.Child is Border border)
			{
				// Find the Yes button and focus it
				var yesButton = border.FindControl<Button>("YesButton");
				yesButton?.Focus();
			}
		}
	}
}
