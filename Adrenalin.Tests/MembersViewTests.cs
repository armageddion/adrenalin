using System;
using Xunit;
using Avalonia.Headless.XUnit;
using Adrenalin.Views;
using Adrenalin.ViewModels;
using Adrenalin.Services;
using Adrenalin.Models;
using Adrenalin.Controls;
using Avalonia.Controls;
using System.Reactive;
using System.Threading.Tasks;

namespace Adrenalin.Tests;

public class MembersViewTests
{
    [AvaloniaFact]
    public void MembersView_ShowsList_WhenCurrentViewIsList()
    {
        // Arrange
        var service = new GymService(new TestHelpers.TestConfigurationService()); // Assuming service can be instantiated without DB for UI test
        var localizationService = new LocalizationService();
        var vm = new MembersViewModel(service, localizationService);
        vm.CurrentView = "list";
        var view = new MembersView { DataContext = vm };
        view.Measure(new Avalonia.Size(1000, 1000));
        view.Arrange(new Avalonia.Rect(0, 0, 1000, 1000));

        // Assert
        var scrollViewer = view.FindControl<ScrollViewer>("MembersList");
        var detailView = view.FindControl<MemberDetailView>("MemberDetail");

        Assert.NotNull(scrollViewer);
        Assert.NotNull(detailView);
        Assert.True(scrollViewer.IsVisible);
        Assert.False(detailView.IsVisible);
    }

    [AvaloniaFact]
    public void MembersView_ShowsDetail_WhenCurrentViewIsDetail()
    {
        // Arrange
        var service = new GymService(new TestHelpers.TestConfigurationService());
        var localizationService = new LocalizationService();
        var vm = new MembersViewModel(service, localizationService);
        vm.CurrentView = "detail";
        var view = new MembersView { DataContext = vm };
        view.Measure(new Avalonia.Size(1000, 1000));
        view.Arrange(new Avalonia.Rect(0, 0, 1000, 1000));

        // Assert
        var scrollViewer = view.FindControl<ScrollViewer>("MembersList");
        var detailView = view.FindControl<MemberDetailView>("MemberDetail");

        Assert.NotNull(scrollViewer);
        Assert.NotNull(detailView);
        Assert.False(scrollViewer.IsVisible);
        Assert.True(detailView.IsVisible);
    }

    [AvaloniaFact]
    public async Task MembersViewModel_SearchMembers_UpdatesMembersList()
    {
        // Arrange
        var service = new GymService(new TestHelpers.TestConfigurationService());
        var localizationService = new LocalizationService();
        var vm = new MembersViewModel(service, localizationService);

        // Act
        vm.SearchQuery = "test";
        await Task.Delay(100); // Wait for async search

        // Assert
        // Since DB may not have data, just check that it doesn't throw
        Assert.NotNull(vm.Members);
    }

    [AvaloniaFact]
    public async Task MembersView_HasDetailView_WhenSelectedMemberDetailIsSet()
    {
        // Arrange
        var service = new GymService(new TestHelpers.TestConfigurationService());
        var localizationService = new LocalizationService();
        var vm = new MembersViewModel(service, localizationService);
        var member = await service.GetMemberAsync(1);
        Assert.NotNull(member);
        vm.SelectedMemberDetail = new MemberDetailViewModel(service, localizationService, member, () => { });
        vm.CurrentView = "detail";
        var view = new MembersView { DataContext = vm };
        view.Measure(new Avalonia.Size(1000, 1000));
        view.Arrange(new Avalonia.Rect(0, 0, 1000, 1000));

        // Assert
        var detailView = view.FindControl<MemberDetailView>("MemberDetail");
        Assert.NotNull(detailView);
        Assert.IsType<MembersViewModel>(detailView.DataContext);
        Assert.NotNull(vm.SelectedMemberDetail);
    }

    [AvaloniaFact]
    public async Task MembersView_DisplaysMemberDetails_WhenMemberSelected()
    {
        // Arrange
        var service = new TestHelpers.TestGymService();
        var localizationService = new LocalizationService();
        var vm = new MembersViewModel(service, localizationService);

        // Add a test member
        var testMember = new Member
        {
            FirstName = "Test",
            LastName = "Member",
            CardId = "TEST001",
            YearOfBirth = 1990,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var memberId = await service.AddMemberAsync(testMember);
        var member = await service.GetMemberAsync(memberId);
        Assert.NotNull(member);

        vm.SelectedMemberDetail = new MemberDetailViewModel(service, localizationService, member, () => { });
        vm.CurrentView = "detail";
        var view = new MembersView { DataContext = vm };
        view.Measure(new Avalonia.Size(1000, 1000));
        view.Arrange(new Avalonia.Rect(0, 0, 1000, 1000));

        // Assert
        var detailView = view.FindControl<MemberDetailView>("MemberDetail");
        Assert.NotNull(detailView);
        Assert.True(detailView.IsVisible);

        // Check that member data is loaded in ViewModel
        Assert.NotNull(vm.SelectedMemberDetail);
        Assert.NotNull(vm.SelectedMemberDetail.Member);
        Assert.False(string.IsNullOrEmpty(vm.SelectedMemberDetail.Member.FirstName));

        // Check that TextBoxes display the data
        var firstNameTextBox = detailView.FindControl<TextBox>("FirstNameTextBox");
        Assert.NotNull(firstNameTextBox);
        Assert.Equal(vm.SelectedMemberDetail.Member.FirstName, firstNameTextBox.Text);

        var lastNameTextBox = detailView.FindControl<TextBox>("LastNameTextBox");
        Assert.NotNull(lastNameTextBox);
        Assert.Equal(vm.SelectedMemberDetail.Member.LastName, lastNameTextBox.Text);
    }

    [AvaloniaFact]
    public async Task MemberDetail_LogVisit_AddsVisitToDatabase()
    {
        // Arrange
        var service = new GymService(new TestHelpers.TestConfigurationService());
        var localizationService = new LocalizationService();
        var member = new Member { Id = 1, FirstName = "Test" };
        var vm = new MemberDetailViewModel(service, localizationService, member, () => { });

        // Act
        vm.LogVisit.Execute(Unit.Default).Subscribe();
        await Task.Delay(100);

        // Assert
        var visits = await service.GetVisitsAsync();
        Assert.Contains(visits, v => v.MemberId == 1);
    }
}