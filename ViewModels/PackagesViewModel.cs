using ReactiveUI;
using System.Collections.ObjectModel;
using System.Reactive;
using System.Reactive.Linq;
using System.Threading.Tasks;
using Adrenalin.Services;
using Adrenalin.Models;

namespace Adrenalin.ViewModels;

public class PackagesViewModel : ReactiveObject
{
    private readonly GymService _service;
    private readonly LocalizationService _localizationService;
    private ObservableCollection<Package> _packages;
    private Package? _selectedPackage;
    private Package _newPackage;
    private bool _isEditing;
    private bool _isLoading;
    private string _currentView = "list";
    private bool _isDetailVisible;
    private PackageDetailViewModel? _selectedPackageDetail;

    public PackagesViewModel(GymService service, LocalizationService localizationService)
    {
        _service = service;
        _localizationService = localizationService;
        _packages = new ObservableCollection<Package>();
        _newPackage = new Package();
        _isDetailVisible = false;

        LoadPackages = ReactiveCommand.CreateFromTask(LoadPackagesAsync);
        AddPackage = ReactiveCommand.Create(AddPackageExecute);
        EditPackage = ReactiveCommand.Create<Package>(EditPackageExecute);
        UpdatePackage = ReactiveCommand.CreateFromTask<Package>(UpdatePackageAsync);
        DeletePackage = ReactiveCommand.CreateFromTask<Package>(DeletePackageAsync);
        BackToList = ReactiveCommand.Create(BackToListExecute);

        // Subscribe to package change messages
        MessageBus.Current.Listen<string>()
            .Where(msg => msg == "PackageDeleted" || msg == "PackageUpdated" || msg == "PackageAdded")
            .Subscribe(async _ => await LoadPackagesAsync());

        // Load data when ViewModel is created
        Task.Run(async () => await LoadPackagesAsync());
    }

    public ObservableCollection<Package> Packages
    {
        get => _packages;
        set => this.RaiseAndSetIfChanged(ref _packages, value);
    }

    public Package? SelectedPackage
    {
        get => _selectedPackage;
        set => this.RaiseAndSetIfChanged(ref _selectedPackage, value);
    }

    public Package NewPackage
    {
        get => _newPackage;
        set => this.RaiseAndSetIfChanged(ref _newPackage, value);
    }

    public bool IsEditing
    {
        get => _isEditing;
        set => this.RaiseAndSetIfChanged(ref _isEditing, value);
    }

    public bool IsLoading
    {
        get => _isLoading;
        set => this.RaiseAndSetIfChanged(ref _isLoading, value);
    }

    public string CurrentView
    {
        get => _currentView;
        set
        {
            this.RaiseAndSetIfChanged(ref _currentView, value);
            IsDetailVisible = value == "detail";
        }
    }

    public bool IsDetailVisible
    {
        get => _isDetailVisible;
        set => this.RaiseAndSetIfChanged(ref _isDetailVisible, value);
    }

    public PackageDetailViewModel? SelectedPackageDetail
    {
        get => _selectedPackageDetail;
        set => this.RaiseAndSetIfChanged(ref _selectedPackageDetail, value);
    }

    public ReactiveCommand<Unit, Unit> LoadPackages { get; }
    public ReactiveCommand<Unit, Unit> AddPackage { get; }
    public ReactiveCommand<Package, Unit> EditPackage { get; }
    public ReactiveCommand<Package, Unit> UpdatePackage { get; }
    public ReactiveCommand<Package, Unit> DeletePackage { get; }
    public ReactiveCommand<Unit, Unit> BackToList { get; }

    // Localized properties
    public string Title => _localizationService.GetString("components.packageList.title");
    public string EditLabel => _localizationService.GetString("buttons.edit");
    public string DeleteLabel => _localizationService.GetString("buttons.delete");
    public string ConfirmDeleteMessage => _localizationService.GetString("messages.confirmDelete");
    public string AddPackageLabel => _localizationService.GetString("buttons.addPackage");
    public string BackToPackagesLabel => _localizationService.GetString("buttons.backToPackages");

    private async Task LoadPackagesAsync()
    {
        IsLoading = true;
        try
        {
            var packages = await _service.GetPackagesAsync();
            Packages.Clear();
            foreach (var package in packages)
            {
                Packages.Add(package);
            }
        }
        finally
        {
            IsLoading = false;
        }
    }

    private void AddPackageExecute()
    {
        SelectedPackageDetail = new PackageDetailViewModel(_service, _localizationService, new Package(), BackToListExecute);
        CurrentView = "detail";
    }

    private void EditPackageExecute(Package package)
    {
        SelectedPackageDetail = new PackageDetailViewModel(_service, _localizationService, package, BackToListExecute);
        CurrentView = "detail";
    }

    private async Task UpdatePackageAsync(Package package)
    {
        await _service.UpdatePackageAsync(package.Id, package);
        await LoadPackagesAsync();
    }

    private async Task DeletePackageAsync(Package package)
    {
        await _service.DeletePackageAsync(package.Id);
        await LoadPackagesAsync();
    }

    private void BackToListExecute()
    {
        CurrentView = "list";
        SelectedPackageDetail = null;
    }
}