using ReactiveUI;
using System.Collections.ObjectModel;
using System.Reactive;
using System.Reactive.Linq;
using System.Threading.Tasks;
using System.Linq;
using Adrenalin.Services;
using Adrenalin.Models;

namespace Adrenalin.ViewModels;

public class MembersViewModel : ReactiveObject
{
    private readonly GymService _service;
    private readonly LocalizationService _localizationService;
    private ObservableCollection<Member> _members;
    private string _searchQuery = string.Empty;
    private int _currentPage = 1;
    private int _totalPages;
    private int _totalItems;
    private bool _isLoading;
    private Member? _selectedMember;
    private Member _newMember;
    private bool _isEditing;
    private string _currentView = "list";
    private bool _isDetailVisible;
    private MemberDetailViewModel? _selectedMemberDetail;
    private readonly object _lock = new object();

    public MembersViewModel(GymService service, LocalizationService localizationService)
    {
        _service = service;
        _localizationService = localizationService;
        _members = new ObservableCollection<Member>();
        _newMember = new Member();
        _isDetailVisible = false;

        LoadMembers = ReactiveCommand.CreateFromTask(LoadMembersAsync);
        SearchMembers = ReactiveCommand.CreateFromTask<string>(SearchMembersAsync);
        AddMember = ReactiveCommand.Create(AddMemberExecute);
        UpdateMember = ReactiveCommand.CreateFromTask<Member>(UpdateMemberAsync);
        DeleteMember = ReactiveCommand.CreateFromTask<Member>(DeleteMemberAsync);
        NextPage = ReactiveCommand.CreateFromTask(NextPageAsync);
        PreviousPage = ReactiveCommand.CreateFromTask(PreviousPageAsync);
        SelectMember = ReactiveCommand.Create<Member>(SelectMemberExecute);
        BackToList = ReactiveCommand.Create(BackToListExecute);

        this.WhenAnyValue(x => x.SearchQuery)
            .Subscribe(async query => await SearchMembersAsync(query));

        // Subscribe to member change messages
        MessageBus.Current.Listen<string>()
            .Where(msg => msg == "MemberDeleted" || msg == "MemberUpdated" || msg == "MemberAdded")
            .Subscribe(async _ => await LoadMembersAsync());

        // Load data when ViewModel is created
        Task.Run(async () => await LoadMembersAsync());
    }

    public ObservableCollection<Member> Members
    {
        get => _members;
        set => this.RaiseAndSetIfChanged(ref _members, value);
    }

    public string SearchQuery
    {
        get => _searchQuery;
        set => this.RaiseAndSetIfChanged(ref _searchQuery, value);
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

    public Member? SelectedMember
    {
        get => _selectedMember;
        set => this.RaiseAndSetIfChanged(ref _selectedMember, value);
    }

    public Member NewMember
    {
        get => _newMember;
        set => this.RaiseAndSetIfChanged(ref _newMember, value);
    }

    public bool IsEditing
    {
        get => _isEditing;
        set => this.RaiseAndSetIfChanged(ref _isEditing, value);
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

    public MemberDetailViewModel? SelectedMemberDetail
    {
        get => _selectedMemberDetail;
        set => this.RaiseAndSetIfChanged(ref _selectedMemberDetail, value);
    }

    public ReactiveCommand<Unit, Unit> LoadMembers { get; }
    public ReactiveCommand<string, Unit> SearchMembers { get; }
    public ReactiveCommand<Unit, Unit> AddMember { get; }
    public ReactiveCommand<Member, Unit> UpdateMember { get; }
    public ReactiveCommand<Member, Unit> DeleteMember { get; }
    public ReactiveCommand<Unit, Unit> NextPage { get; }
    public ReactiveCommand<Unit, Unit> PreviousPage { get; }
    public ReactiveCommand<Member, Unit> SelectMember { get; }
    public ReactiveCommand<Unit, Unit> BackToList { get; }

    // Localized properties
    public string Title => _localizationService.GetString("components.members.title");
    public string SearchPlaceholder => _localizationService.GetString("components.members.searchPlaceholder");
    public string NameLabel => _localizationService.GetString("components.members.name");
    public string EmailLabel => _localizationService.GetString("components.members.email");
    public string ActionsLabel => _localizationService.GetString("components.members.actions");
    public string AddMemberLabel => _localizationService.GetString("buttons.addMember");
    public string EditLabel => _localizationService.GetString("buttons.edit");
    public string DeleteLabel => _localizationService.GetString("buttons.delete");
    public string ViewLabel => _localizationService.GetString("buttons.view");
    public string ConfirmDeleteMessage => _localizationService.GetString("messages.confirmDelete");
    public string LoadingLabel => _localizationService.GetString("loading");
    public string BackToMembersLabel => _localizationService.GetString("buttons.backToMembers");

    private async Task LoadMembersAsync()
    {
        IsLoading = true;
        try
        {
            var members = await _service.GetMembersPaginatedAsync(CurrentPage, 100);
            var totalCount = await _service.GetMembersCountAsync();

            lock (_lock)
            {
                Members.Clear();
                foreach (var member in members)
                {
                    Members.Add(member);
                }
            }

            TotalItems = totalCount;
            TotalPages = (int)System.Math.Ceiling((double)totalCount / 100);
        }
        finally
        {
            IsLoading = false;
        }
    }

    private async Task SearchMembersAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            await LoadMembersAsync();
            return;
        }

        IsLoading = true;
        try
        {
            var members = await _service.SearchMembersAsync(query);
            lock (_lock)
            {
                Members.Clear();
                foreach (var member in members)
                {
                    Members.Add(member);
                }
            }
            TotalItems = members.Count;
            TotalPages = 1;
            CurrentPage = 1;
        }
        finally
        {
            IsLoading = false;
        }
    }

    private void AddMemberExecute()
    {
        SelectedMemberDetail?.Dispose();
        SelectedMemberDetail = new MemberDetailViewModel(_service, _localizationService, new Member(), BackToListExecute);
        CurrentView = "detail";
    }

    private async Task UpdateMemberAsync(Member member)
    {
        await _service.UpdateMemberAsync(member.Id, member);
        await LoadMembersAsync();
    }

    private async Task DeleteMemberAsync(Member member)
    {
        await _service.DeleteMemberAsync(member.Id);
        await LoadMembersAsync();
    }

    private async Task NextPageAsync()
    {
        if (CurrentPage < TotalPages)
        {
            CurrentPage++;
            await LoadMembersAsync();
        }
    }

    private async Task PreviousPageAsync()
    {
        if (CurrentPage > 1)
        {
            CurrentPage--;
            await LoadMembersAsync();
        }
    }

    private async void SelectMemberExecute(Member member)
    {
        var fullMember = await _service.GetMemberAsync(member.Id);
        if (fullMember != null)
        {
            SelectedMemberDetail?.Dispose();
            SelectedMemberDetail = new MemberDetailViewModel(_service, _localizationService, fullMember, BackToListExecute);
            CurrentView = "detail";
        }
    }

    private void BackToListExecute()
    {
        CurrentView = "list";
        SelectedMemberDetail?.Dispose();
        SelectedMemberDetail = null;
    }

    public async void NavigateToMember(int memberId)
    {
        var fullMember = await _service.GetMemberAsync(memberId);
        if (fullMember != null)
        {
            SelectedMemberDetail?.Dispose();
            SelectedMemberDetail = new MemberDetailViewModel(_service, _localizationService, fullMember, BackToListExecute);
            CurrentView = "detail";
        }
    }
}