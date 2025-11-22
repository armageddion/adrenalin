using ReactiveUI;
using System;
using System.Reactive;
using System.Threading.Tasks;
using System.Collections.ObjectModel;
using System.Linq;
using Avalonia.Media.Imaging;
using Avalonia.Threading;
using Adrenalin.Services;
using Adrenalin.Models;
using AvaloniaBitmap = Avalonia.Media.Imaging.Bitmap;

namespace Adrenalin.ViewModels;

public class MemberDetailViewModel : ReactiveObject, IDisposable
{
    private readonly GymService _service;
    private readonly LocalizationService _localizationService;
    private readonly ICameraService _cameraService;
    private Member _member;
    private bool _isEditing;
    private bool _isDetailMode;
    private Action _backAction;
    private AvaloniaBitmap? _currentImage;
    private AvaloniaBitmap? _originalImage;
    private bool _isCameraMode;
    private bool _hasCapturedImage;
    private ObservableCollection<Visit> _visits;
    private Package? _package;
    private ObservableCollection<Package> _availablePackages;
    private bool _showDeleteConfirmation;
    private string _errorMessage;

    public MemberDetailViewModel(GymService service, LocalizationService localizationService, Member member, Action backAction)
    {
        _service = service;
        _localizationService = localizationService;
        _cameraService = new CameraService(); // Could be injected via DI
        _member = member;
        _backAction = backAction;
        _visits = new ObservableCollection<Visit>();
        _availablePackages = new ObservableCollection<Package>();
        _errorMessage = string.Empty;
        _isDetailMode = member.Id > 0; // If member has ID, it's detail mode

        // Load current image if member has one
        if (!string.IsNullOrEmpty(member.Image))
        {
            _currentImage = LoadImageFromBase64(member.Image);
            _originalImage = _currentImage;
        }

        Save = ReactiveCommand.CreateFromTask(SaveAsync);
        Cancel = ReactiveCommand.Create(CancelExecute);
        StartEdit = ReactiveCommand.Create(StartEditExecute);
        LogVisit = ReactiveCommand.CreateFromTask(LogVisitAsync);
        Delete = ReactiveCommand.Create(DeleteExecute);
        ConfirmDelete = ReactiveCommand.CreateFromTask(ConfirmDeleteAsync);
        CancelDelete = ReactiveCommand.Create(CancelDeleteExecute);
        StartCamera = ReactiveCommand.Create(StartCameraExecute);
        CaptureImage = ReactiveCommand.CreateFromTask(CaptureImageAsync);

        KeepImage = ReactiveCommand.Create(KeepImageExecute);
        RevertImage = ReactiveCommand.Create(RevertImageExecute);

        // Load additional data only in detail mode
        if (_isDetailMode)
        {
            Task.Run(async () => await LoadAdditionalDataAsync());
        }
    }

    private async Task LoadAdditionalDataAsync()
    {
        // Load available packages
        var packages = await _service.GetPackagesAsync();
        foreach (var package in packages)
        {
            _availablePackages.Add(package);
        }

        // Load visit history
        var visits = await _service.GetVisitsByMemberIdAsync(_member.Id);
        foreach (var visit in visits)
        {
            _visits.Add(visit);
        }

        // Load package information
        if (_member.PackageId.HasValue)
        {
            _package = packages.FirstOrDefault(p => p.Id == _member.PackageId.Value);
        }
    }

    public Member Member
    {
        get => _member;
        set => this.RaiseAndSetIfChanged(ref _member, value);
    }

    public bool IsEditing
    {
        get => _isEditing;
        set => this.RaiseAndSetIfChanged(ref _isEditing, value);
    }

    public bool IsDetailMode
    {
        get => _isDetailMode;
        set => this.RaiseAndSetIfChanged(ref _isDetailMode, value);
    }

    public ReactiveCommand<Unit, Unit> Save { get; }
    public ReactiveCommand<Unit, Unit> Cancel { get; }
    public ReactiveCommand<Unit, Unit> StartEdit { get; }
    public ReactiveCommand<Unit, Unit> LogVisit { get; }
    public ReactiveCommand<Unit, Unit> Delete { get; }
    public ReactiveCommand<Unit, Unit> ConfirmDelete { get; }
    public ReactiveCommand<Unit, Unit> CancelDelete { get; }
    public ReactiveCommand<Unit, Unit> StartCamera { get; }
    public ReactiveCommand<Unit, Unit> CaptureImage { get; }
    public ReactiveCommand<Unit, Unit> KeepImage { get; }
    public ReactiveCommand<Unit, Unit> RevertImage { get; }

    // Properties
    public AvaloniaBitmap? CurrentImage
    {
        get => _currentImage;
        set => this.RaiseAndSetIfChanged(ref _currentImage, value);
    }

    public bool IsCameraMode
    {
        get => _isCameraMode;
        set => this.RaiseAndSetIfChanged(ref _isCameraMode, value);
    }

    public bool HasCapturedImage
    {
        get => _hasCapturedImage;
        set => this.RaiseAndSetIfChanged(ref _hasCapturedImage, value);
    }

    public bool IsCameraAvailable => _cameraService.IsCameraAvailable;

    public ObservableCollection<Visit> Visits
    {
        get => _visits;
        set => this.RaiseAndSetIfChanged(ref _visits, value);
    }

    public Package? Package
    {
        get => _package;
        set => this.RaiseAndSetIfChanged(ref _package, value);
    }

    public ObservableCollection<Package> AvailablePackages
    {
        get => _availablePackages;
        set => this.RaiseAndSetIfChanged(ref _availablePackages, value);
    }

    public bool ShowDeleteConfirmation
    {
        get => _showDeleteConfirmation;
        set => this.RaiseAndSetIfChanged(ref _showDeleteConfirmation, value);
    }

    public string ErrorMessage
    {
        get => _errorMessage;
        set => this.RaiseAndSetIfChanged(ref _errorMessage, value);
    }

    // Localized properties
    public string SaveLabel => _localizationService.GetString("buttons.save");
    public string CancelLabel => _localizationService.GetString("buttons.cancel");
    public string LogVisitLabel => _localizationService.GetString("buttons.logVisit");
    public string DeleteLabel => _localizationService.GetString("buttons.delete");
    public string EditLabel => _localizationService.GetString("buttons.edit");
    public string BackToMembersLabel => _localizationService.GetString("buttons.backToMembers");
    public string ConfirmDeleteMessage => _localizationService.GetString("messages.confirmDelete");
    public string VisitLoggedMessage => _localizationService.GetString("messages.visitLogged", Member.FirstName);
    public string ImageLabel => _localizationService.GetString("image");
    public string FirstNameLabel => _localizationService.GetString("components.memberForm.firstName");
    public string LastNameLabel => _localizationService.GetString("components.memberForm.lastName");
    public string EmailLabel => _localizationService.GetString("components.memberForm.email");
    public string PhoneLabel => _localizationService.GetString("components.memberForm.phone");
    public string CardIdLabel => _localizationService.GetString("components.memberForm.cardId");
    public string GovIdLabel => _localizationService.GetString("components.memberForm.govId");
    public string YearOfBirthLabel => _localizationService.GetString("components.memberForm.year_of_birth");
    public string PackageLabel => _localizationService.GetString("components.memberForm.package");
    public string ExpiryDateLabel => _localizationService.GetString("components.memberForm.expiryDate");
    public string NotesLabel => _localizationService.GetString("labels.notes");
    public string StreetLabel => _localizationService.GetString("address.street");
    public string NumberLabel => _localizationService.GetString("address.number");
    public string CityLabel => _localizationService.GetString("address.city");
    public string IsGuardianLabel => _localizationService.GetString("components.memberForm.isGuardian");
    public string GuardianFirstNameLabel => _localizationService.GetString("components.memberForm.guardianFirstName");
    public string GuardianLastNameLabel => _localizationService.GetString("components.memberForm.guardianLastName");
    public string GuardianGovIdLabel => _localizationService.GetString("components.memberForm.guardianGovId");
    public string SendNotificationsLabel => _localizationService.GetString("components.memberForm.sendNotifications");
    public string CameraStartLabel => _localizationService.GetString("components.memberForm.cameraStart");
    public string CameraCaptureLabel => _localizationService.GetString("components.memberForm.cameraCapture");
    public string CameraKeepLabel => _localizationService.GetString("components.memberForm.cameraKeep");
    public string CameraRevertLabel => _localizationService.GetString("components.memberForm.cameraRevert");

    // Detail view labels
    public string VisitHistoryLabel => _localizationService.GetString("visitHistory", "Visit History");
    public string PackageInfoLabel => _localizationService.GetString("packageInfo", "Package Information");
    public string GuardianInfoLabel => _localizationService.GetString("guardianInfo", "Guardian Information");
    public string NoVisitsLabel => _localizationService.GetString("noVisits", "No visits recorded");
    public string VisitDateLabel => _localizationService.GetString("visitDate", "Date");
    public string PackageNameLabel => _localizationService.GetString("packageName", "Package");
    public string PackagePriceLabel => _localizationService.GetString("packagePrice", "Price");
    public string PackageExpiryLabel => _localizationService.GetString("packageExpiry", "Expires");



    private async Task SaveAsync()
    {
        // Perform validation
        var validationErrors = await ValidateMemberAsync();
        if (validationErrors.Any())
        {
            ErrorMessage = string.Join("\n", validationErrors);
            return;
        }

        try
        {
            if (Member.Id == 0)
            {
                await _service.AddMemberAsync(Member);
                MessageBus.Current.SendMessage("MemberAdded");
            }
            else
            {
                await _service.UpdateMemberAsync(Member.Id, Member);
                MessageBus.Current.SendMessage("MemberUpdated");
            }
            ErrorMessage = string.Empty;
            IsEditing = false;
            _backAction?.Invoke();
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error saving member: {ex.Message}";
        }
    }

    private async Task<List<string>> ValidateMemberAsync()
    {
        var errors = new List<string>();

        // Required fields
        if (string.IsNullOrWhiteSpace(Member.FirstName))
            errors.Add("First name is required.");
        if (string.IsNullOrWhiteSpace(Member.LastName))
            errors.Add("Last name is required.");
        if (string.IsNullOrWhiteSpace(Member.CardId))
            errors.Add("Card ID is required.");

        // Card ID uniqueness for new members
        if (Member.Id == 0 && !string.IsNullOrWhiteSpace(Member.CardId))
        {
            var existingMember = await _service.GetMemberByCardIdAsync(Member.CardId);
            if (existingMember != null)
            {
                errors.Add("A member with this card ID already exists.");
            }
        }

        // Email format validation
        if (!string.IsNullOrWhiteSpace(Member.Email) && !IsValidEmail(Member.Email))
            errors.Add("Please enter a valid email address.");

        // Year of birth validation
        if (Member.YearOfBirth < 1900 || Member.YearOfBirth > DateTime.Now.Year)
            errors.Add("Please enter a valid year of birth.");

        // Guardian validation
        if (Member.Guardian)
        {
            if (string.IsNullOrWhiteSpace(Member.GuardianFirstName))
                errors.Add("Guardian first name is required when guardian is selected.");
            if (string.IsNullOrWhiteSpace(Member.GuardianLastName))
                errors.Add("Guardian last name is required when guardian is selected.");
        }

        return errors;
    }

    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private void CancelExecute()
    {
        IsEditing = false;
        _backAction?.Invoke();
    }

    private void StartEditExecute()
    {
        IsEditing = true;
    }

    private async Task LogVisitAsync()
    {
        await _service.AddVisitAsync(Member.Id);

        // Add the new visit to the local collection immediately
        var newVisit = new Visit
        {
            MemberId = Member.Id,
            CreatedAt = DateTime.Now,
            MemberFirstName = Member.FirstName,
            MemberLastName = Member.LastName
        };
        Visits.Insert(0, newVisit); // Insert at the beginning since visits are ordered by CreatedAt DESC

        MessageBus.Current.SendMessage("VisitLogged");
    }

    private void DeleteExecute()
    {
        ShowDeleteConfirmation = true;
    }

    private async Task ConfirmDeleteAsync()
    {
        await _service.DeleteMemberAsync(Member.Id);
        ShowDeleteConfirmation = false;
        MessageBus.Current.SendMessage("MemberDeleted");
        _backAction?.Invoke();
    }

    private void CancelDeleteExecute()
    {
        ShowDeleteConfirmation = false;
    }

    private async void StartCameraExecute()
    {
        IsCameraMode = true;
        HasCapturedImage = false;

        try
        {
            // Start live preview directly
            await _cameraService.StartCameraPreviewAsync(frame =>
            {
                CurrentImage = frame;
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Camera preview failed: {ex.Message}");
            IsCameraMode = false;
        }
    }

    private async Task CaptureImageAsync()
    {
        // Stop the preview
        await _cameraService.StopCameraPreviewAsync();

        // The current image from the live preview becomes the captured image
        if (CurrentImage != null)
        {
            // Store original image if this is the first capture
            if (_originalImage == null && _currentImage != null && _currentImage != CurrentImage)
            {
                _originalImage = _currentImage;
            }

            // Keep the current image as captured
            _currentImage = CurrentImage;

            HasCapturedImage = true;
            IsCameraMode = false;
        }
    }

    private void KeepImageExecute()
    {
        // Convert current image to base64 and save to member
        if (CurrentImage != null)
        {
            Member.Image = _cameraService.ConvertBitmapToBase64(CurrentImage);
        }

        _originalImage = _currentImage;
        HasCapturedImage = false;
        IsCameraMode = false;
    }

    private void RevertImageExecute()
    {
        CurrentImage = _originalImage;
        HasCapturedImage = false;
        IsCameraMode = false;
    }

    private AvaloniaBitmap? LoadImageFromBase64(string base64String)
    {
        try
        {
            var imageBytes = Convert.FromBase64String(base64String);
            using var ms = new MemoryStream(imageBytes);
            return new AvaloniaBitmap(ms);
        }
        catch
        {
            return null;
        }
    }

    public void Dispose()
    {
        _cameraService.StopCameraPreviewAsync().Wait();
    }
}