Here is a comprehensive developer documentation guide based on a code review of the **Adrenalin** application.

---

# Adrenalin Application: Developer Review & Implementation Guide

## 1. Executive Summary
This document outlines critical fixes, architectural improvements, and cleanup tasks for the Adrenalin .NET 9.0 Avalonia application. The application currently functions as a hybrid Desktop/Web server solution. While the core logic is functional, there are significant concurrency risks regarding database access and threading models that need immediate attention before production deployment.

## 2. Critical Issues & Bug Fixes

### 2.1. Fix "Fire-and-Forget" Async in Constructors
**Severity:** Critical
**Location:** `DashboardViewModel`, `MembersViewModel`, `PackagesViewModel`, `VisitsViewModel`
**Issue:** Calling `Task.Run(async () => await Load...())` inside a constructor is dangerous. Exceptions thrown here are swallowed or crash the application unpredictably. It also creates race conditions where the View might bind to data before the ViewModel is ready.

**Implementation:**
Use ReactiveUI's `IActivatableViewModel` or initialize data in the `MainWindow` initialization logic.

**Refactor Example (`DashboardViewModel.cs`):**
```csharp
public class DashboardViewModel : ReactiveObject, IActivatableViewModel
{
    public ViewModelActivator Activator { get; } = new ViewModelActivator();

    public DashboardViewModel(...) {
        // ... dependencies
        
        this.WhenActivated((CompositeDisposable disposables) => {
            // Load stats when the view appears
            LoadStats.Execute().Subscribe().DisposeWith(disposables);
        });
    }
}
```
*Note: You must adds `xmlns:rxui="http://reactiveui.net"` to your Views and change `UserControl` to `rxui:ReactiveUserControl<vm:DashboardViewModel>` for this to trigger automatically.*

### 2.2. SQLite Concurrency & Locking
**Severity:** High
**Location:** `GymService.cs`
**Issue:** The application runs an ASP.NET Core Web Server (background thread) and a UI Desktop App (main thread). Both access the SQLite database file. While WAL mode is enabled, simultaneous **writes** (e.g., a mobile user registering while a desk staff member logs a visit) will result in an `SQLITE_BUSY` or "Database is locked" exception because `GymService` creates a new connection for every call without a locking mechanism.

**Implementation:**
Implement a `SemaphoreSlim` in `GymService` to serialize write operations.

```csharp
public class GymService
{
    // Static or Singleton semaphore to control access across the instance
    private static readonly SemaphoreSlim _dbLock = new SemaphoreSlim(1, 1);

    public async Task<int> AddMemberAsync(Member member)
    {
        await _dbLock.WaitAsync();
        try
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            // ... Execute Command ...
        }
        finally
        {
            _dbLock.Release();
        }
    }
    // Apply this pattern to Update, Delete, and Add methods.
}
```

### 2.3. Web Server Shutdown Race Condition
**Severity:** Medium
**Location:** `App.axaml.cs`
**Issue:** In `OnFrameworkInitializationCompleted`, `_webServerService` is stopped in `desktop.ShutdownRequested`. However, `_webServerService` is created inside the `if` block but started in a background `Task.Run`. If the app closes immediately after opening, `_webServerService` might be null or half-initialized.

**Implementation:**
Ensure the server task is tracked and cancelled gracefully using `IHostedService` patterns or ensuring the `_webServerService` instance is fully constructed before the background task starts.

## 3. Architectural Improvements

### 3.1. Introduce Dependency Injection (DI) Container
**Current State:** Manual dependency injection in `App.axaml.cs` and `MainWindow.axaml.cs`.
**Recommendation:** Use `Microsoft.Extensions.DependencyInjection`.
**Benefit:** Simplifies the `App.axaml.cs` file and makes testing easier.

**Implementation:**
1.  Install `Avalonia.ReactiveUI` and `Microsoft.Extensions.DependencyInjection`.
2.  Configure services in `App.axaml.cs`:
    ```csharp
    private IServiceProvider ConfigureServices() {
        var services = new ServiceCollection();
        services.AddSingleton<ConfigurationService>();
        services.AddSingleton<GymService>(); // Now a singleton, helping with DB locking
        services.AddSingleton<WebServerService>();
        services.AddSingleton<LocalizationService>();
        services.AddTransient<MainWindowViewModel>();
        // ... add other ViewModels
        return services.BuildServiceProvider();
    }
    ```

### 3.2. Replace Raw ADO.NET with Dapper
**Location:** `GymService.cs`
**Recommendation:** The current SQL construction involves manual parameter adding and mapping `SqliteDataReader` to objects (`MapToMember`). This is verbose and error-prone.
**Implementation:**
Install `Dapper`.
Refactor `GetMembersAsync`:
```csharp
// OLD
while (await reader.ReadAsync()) { members.Add(MapToMember(reader)); }

// NEW (Dapper)
using var conn = new SqliteConnection(_connectionString);
var members = await conn.QueryAsync<Member>("SELECT * FROM members");
```

## 4. Code Quality & Dead Code

### 4.1. Redundant Converters
**File:** `Converters/Converters.cs`
**Issue:**
*   `Int32CompareConverter`: This generic converter logic is duplicated by `Int32GreaterThanConverter` and `Int32LessThanConverter`.
*   **Recommendation:** Keep only `Int32CompareConverter` and use parameters (e.g., `>:0`, `<:10`) in XAML, or strictly use the specific ones. Delete the unused ones to reduce noise.

### 4.2. Configuration Service "Fire and Forget"
**File:** `ConfigurationService.cs`
**Method:** `GetApiKey()`
**Issue:** `_ = SaveSettingsAsync(settings); // Fire and forget`
**Risk:** If the application crashes immediately after generating a new API Key, the key is lost, but the user might have already noted it down.
**Fix:** Make `GetApiKey` async or use `GetAwaiter().GetResult()` (less ideal) if strictly synchronous, or ensure `SaveSettingsAsync` handles file IO locking.

### 4.3. Hardcoded Paths
**File:** `App.axaml.cs`
**Line:** `var logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "logs" ...)`
**Issue:** On Linux/macOS (AppImage), writing to `BaseDirectory` might be forbidden (read-only file system mount).
**Fix:** Use `StandardPaths` via `Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)` or `UserProfile`.

## 5. Security Recommendations

### 5.1. API Key Storage
**Current:** Stored in plain text in `settings.json`.
**Risk:** Low (Desktop app), but visible.
**Recommendation:** On Windows, use `ProtectedData` (DPAPI). On Linux, stick to file permissions (0600). For now, ensure `.gitignore` excludes `settings.json` if the repo is public.

### 5.2. Web Server Security (CORS & Hosts)
**File:** `WebServerService.cs`
**Issue:** The server binds to `http://*:port`.
1.  **CORS:** The current implementation doesn't explicitly handle CORS preflight (`OPTIONS`) requests. If a mobile browser enforces strict CORS on the embedded JS `fetch` (even though it's same-origin, sometimes mobile network layers interfere), it might fail.
2.  **Firewall:** The app logs "Make sure firewall allows connections," but does not attempt to automate this.
**Fix:** Ensure the `MapPost` and `Use` middleware handles `OPTIONS` requests if you plan to separate the frontend from the backend later.

## 6. Frontend (Web) Improvements

### 6.1. Javascript Validation Sync
**File:** `script.js` vs `Member.cs`
**Issue:** `script.js` checks `yearOfBirth < 1900`. `Member.cs` checks `yearOfBirth < 1900`.
**Recommendation:** Ensure these rules are consistent. If you change the C# validation to `DateTime.Now.Year - 100`, update the JS.
**Bug:** In `script.js`, `formData.yearOfBirth` is parsed as Int. If input is empty, it becomes `NaN`. The validation check needs to handle `NaN`.

### 6.2. Input Masking
**File:** `index.html`
**Recommendation:** Add `inputmode="numeric"` to the Year of Birth and Card ID fields to trigger the numeric keyboard on mobile devices.

## 7. CI/CD Adjustments

### 7.1. PupNet Configuration
**File:** `Adrenalin.pupnet.conf`
**Line:** `AppVersionRelease = 1.0.0[1]`
**Observation:** The `[1]` syntax is specific to PupNet for build numbers. Ensure that when `github.sha` is used in the workflow, this configuration doesn't conflict or cause versioning errors in the final AppImage metadata. It is safer to inject the version via the CLI arguments in `publish.yml` using `-p:Version=...`.

## 8. Implementation Plan (Checklist)

1.  [ ] **Refactor GymService:** Add `SemaphoreSlim` and switch to Dapper.
2.  [ ] **Fix ViewModels:** Remove `Task.Run` in constructors; implement `IActivatableViewModel`.
3.  [ ] **Setup DI:** Move service creation to a centralized `ConfigureServices` method.
4.  [ ] **Fix Logging Path:** Change log location to User Profile/AppData.
5.  [ ] **Frontend Tweak:** Add `inputmode="numeric"` to HTML fields.
6.  [ ] **Testing:** Create a unit test project (`Adrenalin.Tests`) to verify `GymService` CRUD operations.

## 9. Missing Code / Red Flags
*   **Missing:** `Adrenalin.Tests` folder is referenced in the `.sln` but code is not provided. Remove from `.sln` or create the project.
*   **Missing:** `assets` (Icons). Ensure `Adrenalin.x86_64.AppImage` builds have an icon defined in `Adrenalin.pupnet.conf` (`AppIcon = ...`) or the Linux desktop entry will look generic.
