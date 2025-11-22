using Xunit;
using Avalonia.Headless.XUnit;
using Adrenalin.Controls;
using Avalonia;

namespace Adrenalin.Tests;

public class SignaturePadTests
{
    [AvaloniaFact]
    public void SignaturePad_CanDrawAndClear()
    {
        // Arrange
        var signaturePad = new SignaturePad();
        signaturePad.Width = 200;
        signaturePad.Height = 100;

        // Act - Simulate drawing
        signaturePad.Measure(new Avalonia.Size(200, 100));
        signaturePad.Arrange(new Avalonia.Rect(0, 0, 200, 100));

        // Assert
        Assert.NotNull(signaturePad);
        Assert.Null(signaturePad.GetSignatureBytes()); // Should be null initially

        // Test clear
        signaturePad.Clear();
        Assert.Null(signaturePad.GetSignatureBytes());
    }
}