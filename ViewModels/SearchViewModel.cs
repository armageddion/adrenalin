using ReactiveUI;
using System.Collections.ObjectModel;
using System.Reactive;
using System.Reactive.Linq;
using System.Threading.Tasks;
using System.Linq;
using Adrenalin.Services;
using Adrenalin.Models;

namespace Adrenalin.ViewModels;

public class SearchViewModel : ReactiveObject
{
	private readonly GymService _service;
	private readonly LocalizationService _localizationService;
	private readonly MainWindowViewModel _mainWindowViewModel;
	private ObservableCollection<Member> _searchResults;
	private string _searchQuery = string.Empty;
	private bool _isLoading;
	private bool _isVisible;
	private Member? _selectedMember;
	private readonly object _lock = new object();

	public SearchViewModel(GymService service, LocalizationService localizationService, MainWindowViewModel mainWindowViewModel)
	{
		_service = service;
		_localizationService = localizationService;
		_mainWindowViewModel = mainWindowViewModel;
		_searchResults = new ObservableCollection<Member>();

		SearchCommand = ReactiveCommand.CreateFromTask<string>(SearchAsync);
		SelectMemberCommand = ReactiveCommand.Create<Member?>(SelectMember);
		NavigateDownCommand = ReactiveCommand.Create(NavigateDown);
		NavigateUpCommand = ReactiveCommand.Create(NavigateUp);
		CloseCommand = ReactiveCommand.Create(Close);

		this.WhenAnyValue(x => x.SearchQuery)
			.Throttle(System.TimeSpan.FromMilliseconds(300))
			.Where(query => !string.IsNullOrWhiteSpace(query))
			.Subscribe(async query => await SearchAsync(query));
	}

	public ObservableCollection<Member> SearchResults
	{
		get => _searchResults;
		set => this.RaiseAndSetIfChanged(ref _searchResults, value);
	}

	public string SearchQuery
	{
		get => _searchQuery;
		set => this.RaiseAndSetIfChanged(ref _searchQuery, value);
	}

	public bool IsLoading
	{
		get => _isLoading;
		set => this.RaiseAndSetIfChanged(ref _isLoading, value);
	}

	public bool IsVisible
	{
		get => _isVisible;
		set => this.RaiseAndSetIfChanged(ref _isVisible, value);
	}

	public Member? SelectedMember
	{
		get => _selectedMember;
		set => this.RaiseAndSetIfChanged(ref _selectedMember, value);
	}

	public bool HasResults => SearchResults.Count > 0;

	public ReactiveCommand<string, Unit> SearchCommand { get; }
	public ReactiveCommand<Member?, Unit> SelectMemberCommand { get; }
	public ReactiveCommand<Unit, Unit> NavigateDownCommand { get; }
	public ReactiveCommand<Unit, Unit> NavigateUpCommand { get; }
	public ReactiveCommand<Unit, Unit> CloseCommand { get; }

	// Localized properties
	public string SearchPlaceholder => _localizationService.GetString("search.placeholder");
	public string NoResultsMessage => _localizationService.GetString("search.noResults");
	public string SearchingMessage => _localizationService.GetString("search.searching");

	private async Task SearchAsync(string query)
	{
		if (string.IsNullOrWhiteSpace(query))
		{
			lock (_lock)
			{
				SearchResults.Clear();
			}
			return;
		}

		IsLoading = true;
		try
		{
			var results = await _service.SearchMembersAsync(query);
			lock (_lock)
			{
				SearchResults.Clear();
				foreach (var member in results.Take(10)) // Limit to 10 results
				{
					SearchResults.Add(member);
				}
			}
		}
		finally
		{
			IsLoading = false;
		}
	}

	private void SelectMember(Member? member)
	{
		if (member == null) return;

		// Navigate to members tab and show member detail
		_mainWindowViewModel.NavigateToMember(member.Id);
		Close();
	}

	private void NavigateDown()
	{
		if (SearchResults.Count == 0) return;

		var currentIndex = SelectedMember == null ? -1 : SearchResults.IndexOf(SelectedMember);
		var nextIndex = currentIndex + 1;
		if (nextIndex >= SearchResults.Count) nextIndex = 0;

		SelectedMember = SearchResults[nextIndex];
	}

	private void NavigateUp()
	{
		if (SearchResults.Count == 0) return;

		var currentIndex = SelectedMember == null ? SearchResults.Count : SearchResults.IndexOf(SelectedMember);
		var prevIndex = currentIndex - 1;
		if (prevIndex < 0) prevIndex = SearchResults.Count - 1;

		SelectedMember = SearchResults[prevIndex];
	}

	private void Close()
	{
		IsVisible = false;
		SearchQuery = string.Empty;
		SearchResults.Clear();
	}

	public void Show()
	{
		IsVisible = true;
	}
}
