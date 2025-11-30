using ReactiveUI;
using System.Reactive;
using System.Threading.Tasks;
using Adrenalin.Services;
using Adrenalin.Models;
using System.ComponentModel.DataAnnotations;
using System.Collections.ObjectModel;

namespace Adrenalin.ViewModels;

public class RegisterViewModel : ReactiveObject
{
	private readonly GymService _service;
	private readonly LocalizationService _localizationService;
	private readonly Action<int>? _navigateToMember;

	// Form fields
	private string _firstName = string.Empty;
	private string _lastName = string.Empty;
	private string? _email;
	private string? _phone;
	private string _cardId = string.Empty;
	private string? _govId;
	private int? _packageId;
	private DateTime? _expiresAt;
	private string? _notes;
	private string? _addressStreet;
	private string? _addressNumber;
	private string? _addressCity;
	private bool _guardian;
	private string? _guardianFirstName;
	private string? _guardianLastName;
	private string? _guardianGovId;
	private bool _notify = true;
	private int _yearOfBirth;
	private byte[]? _signature;

	// UI state
	private bool _isLoading;
	private string? _errorMessage = string.Empty;
	private ObservableCollection<Package> _packages;

	public RegisterViewModel(GymService service, LocalizationService localizationService, Action<int>? navigateToMember = null)
	{
		_service = service;
		_localizationService = localizationService;
		_navigateToMember = navigateToMember;
		_packages = new ObservableCollection<Package>();

		RegisterMember = ReactiveCommand.CreateFromTask(RegisterMemberAsync);
		ClearSignature = ReactiveCommand.Create(ClearSignatureExecute);

		// Clear error message when form fields change
		this.WhenAnyValue(x => x.FirstName).Subscribe(_ => ClearErrorOnInput());
		this.WhenAnyValue(x => x.LastName).Subscribe(_ => ClearErrorOnInput());
		this.WhenAnyValue(x => x.Email).Subscribe(_ => ClearErrorOnInput());
		this.WhenAnyValue(x => x.Phone).Subscribe(_ => ClearErrorOnInput());
		this.WhenAnyValue(x => x.CardId).Subscribe(_ => ClearErrorOnInput());
		this.WhenAnyValue(x => x.GovId).Subscribe(_ => ClearErrorOnInput());
		this.WhenAnyValue(x => x.YearOfBirth).Subscribe(_ => ClearErrorOnInput());
		this.WhenAnyValue(x => x.Guardian).Subscribe(_ => ClearErrorOnInput());
		this.WhenAnyValue(x => x.GuardianFirstName).Subscribe(_ => ClearErrorOnInput());
		this.WhenAnyValue(x => x.GuardianLastName).Subscribe(_ => ClearErrorOnInput());
		this.WhenAnyValue(x => x.GuardianGovId).Subscribe(_ => ClearErrorOnInput());

		Task.Run(async () => await LoadPackagesAsync());
	}

	// Properties
	public string FirstName
	{
		get => _firstName;
		set => this.RaiseAndSetIfChanged(ref _firstName, value);
	}

	public string LastName
	{
		get => _lastName;
		set => this.RaiseAndSetIfChanged(ref _lastName, value);
	}

	public string? Email
	{
		get => _email;
		set => this.RaiseAndSetIfChanged(ref _email, value);
	}

	public string? Phone
	{
		get => _phone;
		set => this.RaiseAndSetIfChanged(ref _phone, value);
	}

	public string CardId
	{
		get => _cardId;
		set => this.RaiseAndSetIfChanged(ref _cardId, value);
	}

	public string? GovId
	{
		get => _govId;
		set => this.RaiseAndSetIfChanged(ref _govId, value);
	}

	public int? PackageId
	{
		get => _packageId;
		set => this.RaiseAndSetIfChanged(ref _packageId, value);
	}

	public DateTime? ExpiresAt
	{
		get => _expiresAt;
		set => this.RaiseAndSetIfChanged(ref _expiresAt, value);
	}

	public string? Notes
	{
		get => _notes;
		set => this.RaiseAndSetIfChanged(ref _notes, value);
	}

	public string? AddressStreet
	{
		get => _addressStreet;
		set => this.RaiseAndSetIfChanged(ref _addressStreet, value);
	}

	public string? AddressNumber
	{
		get => _addressNumber;
		set => this.RaiseAndSetIfChanged(ref _addressNumber, value);
	}

	public string? AddressCity
	{
		get => _addressCity;
		set => this.RaiseAndSetIfChanged(ref _addressCity, value);
	}

	public bool Guardian
	{
		get => _guardian;
		set => this.RaiseAndSetIfChanged(ref _guardian, value);
	}

	public string? GuardianFirstName
	{
		get => _guardianFirstName;
		set => this.RaiseAndSetIfChanged(ref _guardianFirstName, value);
	}

	public string? GuardianLastName
	{
		get => _guardianLastName;
		set => this.RaiseAndSetIfChanged(ref _guardianLastName, value);
	}

	public string? GuardianGovId
	{
		get => _guardianGovId;
		set => this.RaiseAndSetIfChanged(ref _guardianGovId, value);
	}

	public bool Notify
	{
		get => _notify;
		set => this.RaiseAndSetIfChanged(ref _notify, value);
	}

	public int YearOfBirth
	{
		get => _yearOfBirth;
		set => this.RaiseAndSetIfChanged(ref _yearOfBirth, value);
	}

	public byte[]? Signature
	{
		get => _signature;
		set => this.RaiseAndSetIfChanged(ref _signature, value);
	}

	public bool IsLoading
	{
		get => _isLoading;
		set => this.RaiseAndSetIfChanged(ref _isLoading, value);
	}

	public string? ErrorMessage
	{
		get => _errorMessage;
		set => this.RaiseAndSetIfChanged(ref _errorMessage, value);
	}

	public ObservableCollection<Package> Packages
	{
		get => _packages;
		set => this.RaiseAndSetIfChanged(ref _packages, value);
	}

	public ReactiveCommand<Unit, Unit> RegisterMember { get; }
	public ReactiveCommand<Unit, Unit> ClearSignature { get; }

	// Localized labels
	public string Title => _localizationService.GetString("register.title");
	public string FirstNameLabel => _localizationService.GetString("register.firstName");
	public string LastNameLabel => _localizationService.GetString("register.lastName");
	public string EmailLabel => _localizationService.GetString("register.email");
	public string PhoneLabel => _localizationService.GetString("register.phone");
	public string CardIdLabel => _localizationService.GetString("register.cardId");
	public string GovIdLabel => _localizationService.GetString("register.govId");
	public string PackageLabel => _localizationService.GetString("register.package");
	public string ExpiresAtLabel => _localizationService.GetString("register.expiresAt");
	public string NotesLabel => _localizationService.GetString("register.notes");
	public string AddressLabel => _localizationService.GetString("register.address");
	public string GuardianLabel => _localizationService.GetString("register.guardian");
	public string GuardianFirstNameLabel => _localizationService.GetString("register.guardianFirstName");
	public string GuardianLastNameLabel => _localizationService.GetString("register.guardianLastName");
	public string GuardianGovIdLabel => _localizationService.GetString("register.guardianGovId");
	public string NotifyLabel => _localizationService.GetString("register.notify");
	public string YearOfBirthLabel => _localizationService.GetString("register.yearOfBirth");
	public string SignatureLabel => _localizationService.GetString("register.signature");
	public string RegisterButtonLabel => _localizationService.GetString("register.register");
	public string ClearSignatureLabel => _localizationService.GetString("register.clearSignature");

	private async Task LoadPackagesAsync()
	{
		try
		{
			var packages = await _service.GetPackagesAsync();
			Packages.Clear();
			foreach (var package in packages)
			{
				Packages.Add(package);
			}
		}
		catch (Exception ex)
		{
			ErrorMessage = $"Failed to load packages: {ex.Message}";
		}
	}

	public async Task RegisterMemberAsync()
	{
		IsLoading = true;
		ErrorMessage = "Starting registration...";

		string validationError = ValidateForm();
		if (!string.IsNullOrEmpty(validationError))
		{
			ErrorMessage = validationError;
			IsLoading = false;
			return;
		}

		ErrorMessage = "Form validation passed, proceeding with registration...";

		try
		{
			ErrorMessage = "Creating member object...";

			var member = new Member
			{
				FirstName = FirstName,
				LastName = LastName,
				Email = Email,
				Phone = Phone,
				CardId = CardId,
				GovId = GovId,
				PackageId = PackageId,
				ExpiresAt = ExpiresAt,
				Notes = Notes,
				AddressStreet = AddressStreet,
				AddressNumber = AddressNumber,
				AddressCity = AddressCity,
				Guardian = Guardian,
				GuardianFirstName = GuardianFirstName,
				GuardianLastName = GuardianLastName,
				GuardianGovId = GuardianGovId,
				Notify = Notify,
				YearOfBirth = YearOfBirth,
				Signature = Signature,
				CreatedAt = DateTime.Now,
				UpdatedAt = DateTime.Now
			};

			ErrorMessage = $"Registering member: {FirstName} {LastName}...";
			var memberId = await _service.AddMemberAsync(member);
			ErrorMessage = "Member registered successfully!";

			// Clear form
			ClearForm();

			// Navigate to member details
			_navigateToMember?.Invoke(memberId);

			if (memberId > 0)
			{
				// Clear form after successful registration
				ClearForm();
				ErrorMessage = "Member registered successfully!";
			}
			else
			{
				ErrorMessage = "Failed to register member.";
			}

			// Navigate back or show success message
			// For now, just clear the form
		}
		catch (Exception ex)
		{
			ErrorMessage = $"Registration failed: {ex.Message}";
		}
		finally
		{
			IsLoading = false;
		}
	}

	private string ValidateForm()
	{
		var member = new Member
		{
			FirstName = FirstName,
			LastName = LastName,
			CardId = CardId,
			YearOfBirth = YearOfBirth,
			Guardian = Guardian,
			GuardianFirstName = GuardianFirstName,
			GuardianLastName = GuardianLastName
		};

		return Member.ValidateForRegistration(member);
	}

	private void ClearForm()
	{
		FirstName = string.Empty;
		LastName = string.Empty;
		Email = null;
		Phone = null;
		CardId = string.Empty;
		GovId = null;
		PackageId = null;
		ExpiresAt = null;
		Notes = null;
		AddressStreet = null;
		AddressNumber = null;
		AddressCity = null;
		Guardian = false;
		GuardianFirstName = null;
		GuardianLastName = null;
		GuardianGovId = null;
		Notify = true;
		YearOfBirth = 0;
		Signature = null;
		ErrorMessage = string.Empty;
	}

	private void ClearSignatureExecute()
	{
		Signature = null;
	}

	private void ClearErrorOnInput()
	{
		if (!string.IsNullOrEmpty(ErrorMessage) && !ErrorMessage.Contains("successfully"))
		{
			ErrorMessage = string.Empty;
		}
	}
}
