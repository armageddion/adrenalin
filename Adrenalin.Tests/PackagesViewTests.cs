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

public class PackagesViewTests
{
    [AvaloniaFact]
    public async Task PackagesViewModel_LoadsPackages_OnInitialization()
    {
        // Arrange
        var service = new TestHelpers.TestGymService();
        var localizationService = new LocalizationService();

        // Add a test package
        var testPackage = new Package
        {
            Name = "Test Package",
            Price = 100,
            Description = "Test description",
            DisplayOrder = 1
        };
        await service.AddPackageAsync(testPackage);

        var vm = new PackagesViewModel(service, localizationService);

        // Act
        await Task.Delay(200); // Wait for async load

        // Assert
        Assert.NotNull(vm.Packages);
        Assert.True(vm.Packages.Count > 0, "Packages should be loaded");
    }

    [AvaloniaFact]
    public async Task PackagesView_DisplaysPackages()
    {
        // Arrange
        var service = new TestHelpers.TestGymService();
        var localizationService = new LocalizationService();

        // Add a test package
        var testPackage = new Package
        {
            Name = "Test Package",
            Price = 100,
            Description = "Test description",
            DisplayOrder = 1
        };
        await service.AddPackageAsync(testPackage);

        var vm = new PackagesViewModel(service, localizationService);
        await Task.Delay(200); // Wait for load
        var view = new PackagesView { DataContext = vm };
        view.Measure(new Avalonia.Size(1000, 1000));
        view.Arrange(new Avalonia.Rect(0, 0, 1000, 1000));

        // Assert
        var listBox = view.FindControl<ListBox>("PackagesList");
        Assert.NotNull(listBox);
        Assert.NotNull(listBox.ItemsSource);
        var items = listBox.ItemsSource as System.Collections.IEnumerable;
        Assert.NotNull(items);
        var count = 0;
        foreach (var item in items) count++;
        Assert.True(count > 0, "ListBox should display loaded packages");
    }
}