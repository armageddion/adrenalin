using Xunit;
using Adrenalin.Services;
using Adrenalin.Models;
using System.Threading.Tasks;
using System.Threading;

namespace Adrenalin.Tests;

public class BarcodeScannerServiceTests
{
    [Fact]
    public async Task BarcodeScannerService_ProcessesValidBarcode()
    {
        // Arrange
        var service = new TestHelpers.TestGymService();
        var scanner = new BarcodeScannerService(service);

        // Add a test member
        var member = new Member
        {
            FirstName = "Test",
            LastName = "Member",
            CardId = "12345678",
            YearOfBirth = 1990
        };
        var memberId = await service.AddMemberAsync(member);

        // Act - Simulate barcode input
        foreach (char digit in "12345678")
        {
            scanner.AddDigit(digit);
        }

        // Wait for processing
        await Task.Delay(100);

        // Assert - Check if visit was added
        var visits = await service.GetVisitsAsync();
        Assert.Contains(visits, v => v.MemberId == memberId);
    }

    [Fact]
    public async Task BarcodeScannerService_IgnoresInvalidBarcode()
    {
        // Arrange
        var service = new TestHelpers.TestGymService();
        var scanner = new BarcodeScannerService(service);

        // Get initial visit count
        var initialVisits = await service.GetVisitsAsync();
        var initialCount = initialVisits.Count;

        // Act - Simulate short barcode
        scanner.AddDigit('1');
        scanner.AddDigit('2');
        scanner.AddDigit('3');

        // Wait
        await Task.Delay(1100); // Wait for reset

        // Assert - No additional visits should be added
        var finalVisits = await service.GetVisitsAsync();
        Assert.Equal(initialCount, finalVisits.Count);
    }

    [Fact]
    public async Task BarcodeScannerService_IgnoresNonExistentMember()
    {
        // Arrange
        var service = new TestHelpers.TestGymService();
        var scanner = new BarcodeScannerService(service);

        // Get initial visit count
        var initialVisits = await service.GetVisitsAsync();
        var initialCount = initialVisits.Count;

        // Act - Simulate barcode for non-existent member
        foreach (char digit in "99999999")
        {
            scanner.AddDigit(digit);
        }

        // Wait
        await Task.Delay(100);

        // Assert - No additional visits should be added
        var finalVisits = await service.GetVisitsAsync();
        Assert.Equal(initialCount, finalVisits.Count);
    }
}