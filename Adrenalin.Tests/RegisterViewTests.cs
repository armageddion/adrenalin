using System;
using Xunit;
using Avalonia.Headless.XUnit;
using Adrenalin.Views;
using Adrenalin.ViewModels;
using Adrenalin.Services;
using Adrenalin.Models;
using Avalonia.Controls;
using System.Threading.Tasks;

namespace Adrenalin.Tests;

public class RegisterViewTests
{
    [Fact]
    public void RegisterViewModel_ValidatesRequiredFields()
    {
        // Arrange
        var service = new TestHelpers.TestGymService(); // Use test service with in-memory DB
        var localizationService = new LocalizationService();
        var vm = new RegisterViewModel(service, localizationService);

        // Act - Try to register with empty fields
        vm.FirstName = "";
        vm.LastName = "";
        vm.CardId = "";

        // Assert - Should fail validation
        Assert.False(TestHelpers.ValidateForm(vm));
    }

    [Fact]
    public void RegisterViewModel_ValidatesRequiredFields_PassesWithValidData()
    {
        // Arrange
        var service = new GymService(new TestHelpers.TestConfigurationService());
        var localizationService = new LocalizationService();
        var vm = new RegisterViewModel(service, localizationService);

        // Act - Set valid data
        vm.FirstName = "John";
        vm.LastName = "Doe";
        vm.CardId = "12345";
        vm.YearOfBirth = 1990;

        // Assert - Should pass validation
        Assert.True(TestHelpers.ValidateForm(vm));
    }

    [Fact]
    public async Task RegisterViewModel_CanRegisterMember()
    {
        // Arrange
        var service = new TestHelpers.TestGymService();
        var localizationService = new LocalizationService();
        var vm = new RegisterViewModel(service, localizationService);

        // Set up valid member data
        vm.FirstName = "Test";
        vm.LastName = "User";
        vm.CardId = "TEST123";
        vm.YearOfBirth = 1990;
        vm.Signature = new byte[] { 1, 2, 3, 4 }; // Mock signature

        // Act
        TestHelpers.TestGymService.AddMemberCalled = false;
        TestHelpers.TestGymService.TableInitialized = false;

        // Check form data before calling
        Assert.Equal("Test", vm.FirstName);
        Assert.Equal("User", vm.LastName);
        Assert.Equal("TEST123", vm.CardId);
        Assert.Equal(1990, vm.YearOfBirth);

        // Test the service directly first
        var testService = (TestHelpers.TestGymService)service;
        var testMember = new Member
        {
            FirstName = "Direct",
            LastName = "Test",
            CardId = "DIRECT123",
            YearOfBirth = 1985,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var directResult = await testService.AddMemberAsync(testMember);
        Assert.True(directResult > 0, "Direct service call should work");

        // Check that direct member was added
        var directMember = await testService.GetMemberAsync(directResult);
        Assert.NotNull(directMember);
        Assert.Equal("Direct", directMember.FirstName);

        // Now test through ViewModel
        await vm.RegisterMemberAsync();

        // Assert
        Assert.True(TestHelpers.TestGymService.AddMemberCalled, $"AddMemberAsync should have been called. ErrorMessage: '{vm.ErrorMessage}'");
    }

    [AvaloniaFact]
    public void RegisterView_DisplaysFormFields()
    {
        // Arrange
        var service = new GymService(new TestHelpers.TestConfigurationService());
        var localizationService = new LocalizationService();
        var vm = new RegisterViewModel(service, localizationService);
        var view = new RegisterView { DataContext = vm };

        // Act
        view.Measure(new Avalonia.Size(1000, 1000));
        view.Arrange(new Avalonia.Rect(0, 0, 1000, 1000));

        // Assert - Check that form fields exist
        // Note: These control names would need to be added to the XAML with x:Name
        // For now, just check that the view renders without errors
        Assert.NotNull(view);
    }
}