using ReactiveUI;
using System;
using System.Reactive;
using System.Reactive.Linq;
using System.Windows.Input;
using Adrenalin.Services;
using Adrenalin.Views;
using Avalonia.Controls;
using Avalonia.Platform.Storage;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;

namespace Adrenalin.ViewModels;

public class SetupViewModel : ReactiveObject
{
    private readonly GymService _service;
    private readonly Window _window;
    private readonly ConfigurationService _configurationService;
    private string _errorMessage = string.Empty;
    private readonly ObservableAsPropertyHelper<bool> _isErrorVisible;

    public SetupViewModel(GymService service, Window window, ConfigurationService configurationService)
    {
        _service = service;
        _window = window;
        _configurationService = configurationService;

        SelectDatabaseCommand = ReactiveCommand.CreateFromTask(SelectDatabaseAsync);
        CreateNewDatabaseCommand = ReactiveCommand.CreateFromTask(CreateNewDatabaseAsync);

        _isErrorVisible = this.WhenAnyValue(x => x.ErrorMessage, msg => !string.IsNullOrEmpty(msg)).ToProperty(this, x => x.IsErrorVisible);
    }

    public ReactiveCommand<Unit, Unit> SelectDatabaseCommand { get; }
    public ReactiveCommand<Unit, Unit> CreateNewDatabaseCommand { get; }

    public string ErrorMessage
    {
        get => _errorMessage;
        set => this.RaiseAndSetIfChanged(ref _errorMessage, value);
    }

    public bool IsErrorVisible => _isErrorVisible.Value;

    private async Task SelectDatabaseAsync()
    {
        ErrorMessage = string.Empty;
        try
        {
            var files = await _window.StorageProvider.OpenFilePickerAsync(new FilePickerOpenOptions
            {
                Title = "Select SQLite Database File",
                AllowMultiple = false,
                FileTypeFilter = new[]
                {
                    new FilePickerFileType("SQLite Database")
                    {
                        Patterns = new[] { "*.db", "*.sqlite" }
                    },
                    new FilePickerFileType("All Files")
                    {
                        Patterns = new[] { "*" }
                    }
                }
            });

            if (files.Count > 0)
            {
                var sourcePath = files[0].Path.LocalPath;

                // Validate that the selected file is a valid SQLite database
                if (!IsValidSqliteDatabase(sourcePath))
                {
                    ErrorMessage = "The selected file is not a valid SQLite database.";
                    return;
                }

                var dbPath = Environment.GetEnvironmentVariable("ADRENALIN_DB_PATH") ??
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".adrenalin", "adrenalin.db");
                var dbDirectory = Path.GetDirectoryName(dbPath);
                if (!string.IsNullOrEmpty(dbDirectory))
                {
                    Directory.CreateDirectory(dbDirectory);
                }

                // Copy the selected database file
                File.Copy(sourcePath, dbPath, true);

                // Close setup and open main window
                CompleteSetup();
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error selecting database: {ex.Message}";
        }
    }

    private async Task CreateNewDatabaseAsync()
    {
        ErrorMessage = string.Empty;
        try
        {
            // Ensure tables are created (blank database)
            await _service.GetMembersAsync(); // This will trigger EnsureTableExistsAsync

            // Close setup and open main window
            CompleteSetup();
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error creating database: {ex.Message}";
        }
    }

    private bool IsValidSqliteDatabase(string filePath)
    {
        try
        {
            using var conn = new SqliteConnection($"Data Source={filePath}");
            conn.Open();
            // Try to execute a simple query
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT 1";
            cmd.ExecuteScalar();
            return true;
        }
        catch
        {
            return false;
        }
    }

    private void CompleteSetup()
    {
        // Close the setup window and show main window
        var mainWindow = new MainWindow(_configurationService);
        mainWindow.Show();
        _window.Close();
    }
}