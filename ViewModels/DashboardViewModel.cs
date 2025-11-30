using ReactiveUI;
using System.Reactive;
using System.Threading.Tasks;
using Adrenalin.Services;
using Adrenalin.Models;

namespace Adrenalin.ViewModels;

/// <summary>
/// ViewModel for the dashboard view, providing statistics and metrics about gym operations.
/// </summary>
public class DashboardViewModel : ReactiveObject
{
	private readonly GymService _service;
	private readonly LocalizationService _localizationService;
	private int _newMembers30Days;
	private int _visitsToday;
	private int _visitsLast7Days;
	private int _visitsPrevious7Days;
	private int _visitsLast30Days;
	private int _visitsPrevious30Days;

	/// <summary>
	/// Initializes a new instance of the DashboardViewModel.
	/// </summary>
	/// <param name="service">The gym service for data operations.</param>
	/// <param name="localizationService">The localization service for translations.</param>
	public DashboardViewModel(GymService service, LocalizationService localizationService)
	{
		_service = service;
		_localizationService = localizationService;
		LoadStats = ReactiveCommand.CreateFromTask(LoadStatsAsync);

		// Handle command exceptions
		LoadStats.ThrownExceptions.Subscribe(ex =>
		{
			// Log or handle error, but don't crash the app
			Console.WriteLine($"Error loading dashboard stats: {ex.Message}");
		});

		// Load stats when ViewModel is created
		Task.Run(async () => await LoadStatsAsync());
	}

	public int NewMembers30Days
	{
		get => _newMembers30Days;
		set => this.RaiseAndSetIfChanged(ref _newMembers30Days, value);
	}

	public int VisitsToday
	{
		get => _visitsToday;
		set => this.RaiseAndSetIfChanged(ref _visitsToday, value);
	}

	public int VisitsLast7Days
	{
		get => _visitsLast7Days;
		set => this.RaiseAndSetIfChanged(ref _visitsLast7Days, value);
	}

	public int VisitsPrevious7Days
	{
		get => _visitsPrevious7Days;
		set => this.RaiseAndSetIfChanged(ref _visitsPrevious7Days, value);
	}

	public int VisitsLast30Days
	{
		get => _visitsLast30Days;
		set => this.RaiseAndSetIfChanged(ref _visitsLast30Days, value);
	}

	public int VisitsPrevious30Days
	{
		get => _visitsPrevious30Days;
		set => this.RaiseAndSetIfChanged(ref _visitsPrevious30Days, value);
	}

	public ReactiveCommand<Unit, Unit> LoadStats { get; }

	// Localized properties
	public string Title => _localizationService.GetString("components.dashboard.title");
	public string Welcome => _localizationService.GetString("components.dashboard.welcome");
	public string NewMembersLabel => _localizationService.GetString("components.dashboard.newMembers");
	public string VisitsTodayLabel => _localizationService.GetString("components.dashboard.visitsToday");
	public string VisitsLast7DaysLabel => _localizationService.GetString("components.dashboard.visitsLast7Days");
	public string VisitsLast30DaysLabel => _localizationService.GetString("components.dashboard.visitsLast30Days");
	public string FromPrevious7Days => _localizationService.GetString("components.dashboard.fromPrevious7Days");
	public string FromPrevious30Days => _localizationService.GetString("components.dashboard.fromPrevious30Days");

	/// <summary>
	/// Loads dashboard statistics from the database.
	/// </summary>
	private async Task LoadStatsAsync()
	{
		NewMembers30Days = await _service.GetNewMembersLast30DaysAsync();
		VisitsToday = await _service.GetVisitsTodayAsync();
		VisitsLast7Days = await _service.GetVisitsLast7DaysAsync();
		VisitsPrevious7Days = await _service.GetVisitsPrevious7DaysAsync();
		VisitsLast30Days = await _service.GetVisitsLast30DaysAsync();
		VisitsPrevious30Days = await _service.GetVisitsPrevious30DaysAsync();
	}
}
