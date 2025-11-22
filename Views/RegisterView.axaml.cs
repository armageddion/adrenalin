using Avalonia.Controls;
using Adrenalin.Controls;
using Avalonia.Interactivity;
using ReactiveUI;
using System.Windows.Input;

namespace Adrenalin.Views
{
    public partial class RegisterView : UserControl
    {
        public RegisterView()
        {
            InitializeComponent();
        }

        protected override void OnInitialized()
        {
            base.OnInitialized();

            if (RegisterButton != null)
            {
                RegisterButton.Click += RegisterButtonClicked;
            }
        }

        private async void RegisterButtonClicked(object? sender, RoutedEventArgs e)
        {
            System.Diagnostics.Debug.WriteLine("RegisterButtonClicked called");

            if (DataContext is ViewModels.RegisterViewModel viewModel)
            {
                System.Diagnostics.Debug.WriteLine("ViewModel found");

                // Capture signature before registering
                if (SignaturePadControl is SignaturePad pad)
                {
                    viewModel.Signature = pad.GetSignatureBytes();
                    System.Diagnostics.Debug.WriteLine("Signature captured");
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine("SignaturePadControl is null");
                }

                // Execute the registration
                System.Diagnostics.Debug.WriteLine("Calling RegisterMemberAsync");
                await viewModel.RegisterMemberAsync();
                System.Diagnostics.Debug.WriteLine("RegisterMemberAsync completed");
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("DataContext is not RegisterViewModel");
            }
        }

        private void ClearSignatureClicked(object? sender, RoutedEventArgs e)
        {
            if (SignaturePadControl is SignaturePad pad)
            {
                pad.Clear();
            }

            // Also clear the ViewModel's signature
            if (DataContext is ViewModels.RegisterViewModel viewModel)
            {
                viewModel.Signature = null;
            }
        }
    }
}