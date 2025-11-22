Here is a comprehensive technical review and implementation guide for the Adrenalin application.

This document is intended for the developer to address critical functional gaps, architectural inconsistencies, and maintenance issues found in the provided codebase.

---

# Adrenalin Application: Developer Implementation Guide

## 1. Executive Summary
The application is a solid start using Avalonia for the Desktop UI and ASP.NET Core for a local mobile registration interface. However, there are **critical functional gaps** (specifically regarding Signature capture on Desktop) and **Architecture violations** (DRY principles regarding Settings) that need immediate attention.

## 2. Critical Issues (High Priority)

### 2.1. Desktop Signature Pad is Non-Functional
**Location:** `Controls/SignaturePad.cs`
**Issue:** The `GetSignatureBytes()` method currently returns placeholder text instead of the actual image data.
```csharp
// Current Code
return System.Text.Encoding.UTF8.GetBytes("signature_present");
```
**Recommendation:**
You must implement the rendering of the vector strokes to a bitmap.
1.  Create a `RenderTargetBitmap` of the `Canvas` dimensions.
2.  Render the visual tree of the Canvas to that bitmap.
3.  Save the bitmap to a `MemoryStream` as PNG.
4.  Return the byte array.

### 2.2. SQLite Concurrency (Database Locking)
**Location:** `Services/GymService.cs`
**Issue:** The application accepts writes from the Desktop UI and the Web API concurrently. SQLite defaults to a rollback journal which handles concurrency poorly, leading to "Database is locked" exceptions.
**Recommendation:**
Enable Write-Ahead Logging (WAL) mode in the connection string or upon initialization.
Update `GymService.cs` constructor or initialization:
```csharp
using var conn = new SqliteConnection(ConnectionString);
await conn.OpenAsync();
using var cmd = conn.CreateCommand();
cmd.CommandText = "PRAGMA journal_mode = WAL;";
await cmd.ExecuteNonQueryAsync();
```

### 2.3. CI/CD Artifact Path Mismatch
**Location:** `.github/workflows/publish.yml`
**Issue:** The Windows build step uploads `Adrenalin.x64.exe`. However, PupNet with `kind: setup` usually generates an installer file (e.g., `Adrenalin-Setup-[version].exe`) in the output directory, not just the raw executable.
**Recommendation:**
Check the PupNet output filename. You likely want to upload the **Setup** file, not the raw executable, or change `kind` to `zip` if you want a portable executable.

---

## 3. Architectural Improvements & Refactoring

### 3.1. Centralize Configuration Logic (DRY Violation)
**Locations:** `App.axaml.cs`, `GymService.cs`, `SettingsViewModel.cs`
**Issue:** Logic for finding `settings.json`, parsing it, determining the database path, and handling the API Key is duplicated across three files.
**Recommendation:**
1.  Create a `Services/ConfigurationService.cs`.
2.  Move `GetSettingsPath`, `LoadSettings`, `SaveSettings`, `GetDatabasePath`, and `GetApiKey` logic into this service.
3.  Inject `ConfigurationService` into `GymService`, `SettingsViewModel`, and `WebServerService`.

### 3.2. Raw SQL Maintenance
**Location:** `Services/GymService.cs`
**Issue:** Large raw SQL strings are error-prone and hard to maintain.
**Recommendation:**
Since you are already using `Microsoft.Data.Sqlite`, consider adding **Dapper**. It allows you to map query results directly to your Models (`Member`, `Visit`) without manually reading every column (e.g., `reader.GetString(reader.GetOrdinal("first_name"))`).
*Example:*
```csharp
// Replaces 20 lines of manual mapping
return await conn.QueryAsync<Member>("SELECT * FROM members");
```

### 3.3. Web Server Asset Injection
**Location:** `Services/WebServerService.cs`
**Issue:** The API Key is injected via string replacement (`htmlContent.Replace("</head>"...`). This is fragile.
**Recommendation:**
Create a specific endpoint (e.g., `/api/config`) that the frontend JavaScript fetches on load to retrieve the API Key or public configuration, rather than modifying the HTML string at runtime.

---

## 4. Code Cleanup & Dead Code

### 4.1. Remove "Console" Logging
**Location:** `Services/CameraService.cs`
**Issue:** There are many `Console.WriteLine` calls.
**Recommendation:**
Replace all `Console.WriteLine` with the Serilog instance (`Log.Information`, `Log.Error`) used elsewhere in the app.

### 4.2. Unused Project Reference
**Location:** `Adrenalin.csproj`
**Issue:**
```xml
<Compile Remove="Adrenalin.Tests\**" />
```
**Recommendation:**
If the tests are in a separate folder but sharing the CSPROJ, this is bad practice. Move tests to their own project (`Adrenalin.Tests.csproj`) and remove this line. If the folder doesn't exist, remove the line.

### 4.3. Duplicate Converters
**Location:** `Converters/Converters.cs`
**Issue:** `Int32GreaterThanConverter` and `Int32LessThanConverter` logic is nearly identical.
**Recommendation:**
Create a generic `Int32CompareConverter` with a parameter that specifies the operation (`>`, `<`, `=`) or keep them separate but ensure they inherit from a common base if logic grows.

---

## 5. Security Considerations

### 5.1. API Key Exposure
**Location:** `WebServerService.cs` / `index.html`
**Issue:** `window.API_KEY = '...'` exposes the key to anyone who can view the page source on the local network.
**Analysis:** For a local intranet app, this is often "accepted risk," but be aware that this is **not secure**.
**Recommendation:**
If higher security is needed, the mobile app should require a user login (username/password) validated against the database, issuing a temporary session token, rather than a static global API key.

### 5.2. File Access
**Location:** `WebServerService.cs`
**Issue:** `app.UseStaticFiles` uses `PhysicalFileProvider`.
**Recommendation:**
Ensure `wwwroot` does not contain any sensitive data. The current code correctly checks for directory existence, which is good.

---

## 6. Implementation Plan (Checklist)

1.  **Fix Desktop Signature:** Implement `RenderTargetBitmap` logic in `SignaturePad.cs`.
2.  **Fix Database Locking:** Add `PRAGMA journal_mode = WAL;` to `GymService` initialization.
3.  **Refactor Settings:** Create `ConfigurationService.cs` and refactor `App.axaml.cs`, `GymService.cs`, and `SettingsViewModel.cs`.
4.  **Cleanup Logging:** Replace `Console.WriteLine` in `CameraService.cs` with Serilog.
5.  **Fix CI/CD:** Verify the artifact name in `publish.yml` matches PupNet's output (check `bin/` output locally first).
6.  **Web Frontend:** (Optional) Move API Key injection to a fetch request.

## 7. Specific Code Fix for SignaturePad (Item 2.1)

Here is the code to make the Desktop signature pad functional:

```csharp
// In Controls/SignaturePad.cs

public byte[]? GetSignatureBytes()
{
    if (_strokes.Count == 0) return null;

    // 1. Determine bounds
    var width = this.Bounds.Width;
    var height = this.Bounds.Height;
    if (width <= 0 || height <= 0) width = 400; height = 200;

    // 2. Render to bitmap
    // Note: You might need to render the 'Child' (Canvas), not 'this' (Border) 
    // depending on Avalonia version, usually rendering the Canvas works best.
    if (Child is not Control canvasControl) return null;

    // Force a layout pass to ensure everything is positioned
    canvasControl.Measure(new Size(width, height));
    canvasControl.Arrange(new Rect(0, 0, width, height));

    var pixelSize = new PixelSize((int)width, (int)height);
    var bitmap = new RenderTargetBitmap(pixelSize, new Vector(96, 96));
    
    bitmap.Render(canvasControl);

    // 3. Save to Byte Array
    using var stream = new MemoryStream();
    bitmap.Save(stream);
    return stream.ToArray();
}
```
