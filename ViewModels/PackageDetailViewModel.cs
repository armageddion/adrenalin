using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Reactive;
using System.Threading.Tasks;
using Adrenalin.Services;
using Adrenalin.Models;

namespace Adrenalin.ViewModels;

public class PackageDetailViewModel : ReactiveObject
{
    private readonly GymService _service;
    private readonly LocalizationService _localizationService;
    private Package _package;
    private Action _backAction;
    private string _errorMessage;
    private bool _isEditing;

    public PackageDetailViewModel(GymService service, LocalizationService localizationService, Package package, Action backAction)
    {
        _service = service;
        _localizationService = localizationService;
        _package = package;
        _backAction = backAction;
        _errorMessage = string.Empty;
        _isEditing = package.Id == 0; // New package starts in edit mode

        Save = ReactiveCommand.CreateFromTask(SaveAsync);
        Cancel = ReactiveCommand.Create(CancelExecute);
    }

    public Package Package
    {
        get => _package;
        set => this.RaiseAndSetIfChanged(ref _package, value);
    }

    public bool IsEditing
    {
        get => _isEditing;
        set => this.RaiseAndSetIfChanged(ref _isEditing, value);
    }

    public string ErrorMessage
    {
        get => _errorMessage;
        set => this.RaiseAndSetIfChanged(ref _errorMessage, value);
    }

    public ReactiveCommand<Unit, Unit> Save { get; }
    public ReactiveCommand<Unit, Unit> Cancel { get; }

    // Localized properties
    public string SaveLabel => _localizationService.GetString("buttons.save");
    public string CancelLabel => _localizationService.GetString("buttons.cancel");
    public string NameLabel => _localizationService.GetString("components.packageForm.name");
    public string DescriptionLabel => _localizationService.GetString("components.packageForm.description");
    public string PriceLabel => _localizationService.GetString("components.packageForm.price");
    public string Title => Package.Id == 0 ? _localizationService.GetString("components.packageForm.addTitle") : _localizationService.GetString("components.packageForm.editTitle");

    private async Task SaveAsync()
    {
        // Perform validation
        var validationErrors = ValidatePackage();
        if (validationErrors.Count > 0)
        {
            ErrorMessage = string.Join("\n", validationErrors);
            return;
        }

        try
        {
            if (Package.Id == 0)
            {
                await _service.AddPackageAsync(Package);
                MessageBus.Current.SendMessage("PackageAdded");
            }
            else
            {
                await _service.UpdatePackageAsync(Package.Id, Package);
                MessageBus.Current.SendMessage("PackageUpdated");
            }
            ErrorMessage = string.Empty;
            IsEditing = false;
            _backAction?.Invoke();
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error saving package: {ex.Message}";
        }
    }

    private List<string> ValidatePackage()
    {
        var errors = new List<string>();

        // Required fields
        if (string.IsNullOrWhiteSpace(Package.Name))
            errors.Add("Package name is required.");

        // Price validation
        if (Package.Price.HasValue && Package.Price.Value < 0)
            errors.Add("Price cannot be negative.");

        return errors;
    }

    private void CancelExecute()
    {
        IsEditing = false;
        _backAction?.Invoke();
    }
}