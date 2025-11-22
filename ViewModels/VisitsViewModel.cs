using ReactiveUI;
using System.Collections.ObjectModel;
using System.Reactive;
using System.Reactive.Linq;
using System.Threading.Tasks;
using Adrenalin.Services;
using Adrenalin.Models;

namespace Adrenalin.ViewModels;

public class VisitsViewModel : ReactiveObject
{
    private readonly GymService _service;
    private readonly LocalizationService _localizationService;
    private ObservableCollection<Visit> _visits;
    private string _cardId = string.Empty;
    private int _currentPage = 1;
    private int _totalPages;
    private int _totalItems;
    private bool _isLoading;
    private bool _showLogVisit;

    public VisitsViewModel(GymService service, LocalizationService localizationService)
    {
        _service = service;
        _localizationService = localizationService;
        _visits = new ObservableCollection<Visit>();

        LoadVisits = ReactiveCommand.CreateFromTask(LoadVisitsAsync);
        LogVisit = ReactiveCommand.CreateFromTask(LogVisitAsync);
        DeleteVisit = ReactiveCommand.CreateFromTask<Visit>(DeleteVisitAsync);
        NextPage = ReactiveCommand.CreateFromTask(NextPageAsync);
        PreviousPage = ReactiveCommand.CreateFromTask(PreviousPageAsync);

        // Subscribe to visit logged messages
        MessageBus.Current.Listen<string>()
            .Where(msg => msg == "VisitLogged")
            .Subscribe(async _ => await LoadVisitsAsync());

        // Load data when ViewModel is created
        Task.Run(async () => await LoadVisitsAsync());
    }

    public ObservableCollection<Visit> Visits
    {
        get => _visits;
        set => this.RaiseAndSetIfChanged(ref _visits, value);
    }

    public string CardId
    {
        get => _cardId;
        set => this.RaiseAndSetIfChanged(ref _cardId, value);
    }

    public int CurrentPage
    {
        get => _currentPage;
        set => this.RaiseAndSetIfChanged(ref _currentPage, value);
    }

    public int TotalPages
    {
        get => _totalPages;
        set => this.RaiseAndSetIfChanged(ref _totalPages, value);
    }

    public int TotalItems
    {
        get => _totalItems;
        set => this.RaiseAndSetIfChanged(ref _totalItems, value);
    }

    public bool IsLoading
    {
        get => _isLoading;
        set => this.RaiseAndSetIfChanged(ref _isLoading, value);
    }

    public bool ShowLogVisit
    {
        get => _showLogVisit;
        set => this.RaiseAndSetIfChanged(ref _showLogVisit, value);
    }

    public ReactiveCommand<Unit, Unit> LoadVisits { get; }
    public ReactiveCommand<Unit, Unit> LogVisit { get; }
    public ReactiveCommand<Visit, Unit> DeleteVisit { get; }
    public ReactiveCommand<Unit, Unit> NextPage { get; }
    public ReactiveCommand<Unit, Unit> PreviousPage { get; }

    // Localized properties
    public string Title => _localizationService.GetString("components.visits.title");
    public string MemberLabel => _localizationService.GetString("components.visits.member");
    public string DateLabel => _localizationService.GetString("components.visits.date");
    public string NotesLabel => _localizationService.GetString("components.visits.notes");
    public string ActionsLabel => _localizationService.GetString("components.members.actions");
    public string LogVisitLabel => _localizationService.GetString("buttons.logVisit");
    public string DeleteLabel => _localizationService.GetString("buttons.delete");
    public string ConfirmDeleteMessage => _localizationService.GetString("messages.confirmDelete");
    public string CardIdQueryLabel => _localizationService.GetString("nav.cardIdQuery");
    public string EnterCardIdLabel => _localizationService.GetString("nav.enterCardId");
    public string QueryLabel => _localizationService.GetString("nav.query");

    private async Task LoadVisitsAsync()
    {
        IsLoading = true;
        try
        {
            var visits = await _service.GetVisitsPaginatedAsync(CurrentPage, 100);
            var totalCount = await _service.GetVisitsCountAsync();

            Visits.Clear();
            foreach (var visit in visits)
            {
                Visits.Add(visit);
            }

            TotalItems = totalCount;
            TotalPages = (int)System.Math.Ceiling((double)totalCount / 100);
        }
        finally
        {
            IsLoading = false;
        }
    }

    private async Task LogVisitAsync()
    {
        if (string.IsNullOrWhiteSpace(CardId))
            return;

        var members = await _service.SearchMembersAsync(CardId);
        var member = members.FirstOrDefault();
        if (member != null)
        {
            await _service.AddVisitAsync(member.Id);
            CardId = string.Empty;
            await LoadVisitsAsync();
        }
    }

    private async Task DeleteVisitAsync(Visit visit)
    {
        await _service.DeleteVisitAsync(visit.Id);
        await LoadVisitsAsync();
    }

    private async Task NextPageAsync()
    {
        if (CurrentPage < TotalPages)
        {
            CurrentPage++;
            await LoadVisitsAsync();
        }
    }

    private async Task PreviousPageAsync()
    {
        if (CurrentPage > 1)
        {
            CurrentPage--;
            await LoadVisitsAsync();
        }
    }
}