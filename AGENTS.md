# AGENTS.md - Development Guidelines for Adrenalin

## Build/Lint/Test Commands

### Build & Run
- `dotnet build` - Build the project
- `dotnet run` - Run the application
- `dotnet format Adrenalin.csproj` - Format code and apply style fixes
- `dotnet format --verify-no-changes` - Check if code is properly formatted
- `rm ~/.adrenalin/adrenalin.db` - Clear the database file

### Database Path Resolution
Database location is determined in this order:
1. `ADRENALIN_DB_PATH` environment variable (if set)
2. `DatabasePath` in `settings.json` (if not empty)
3. Default: `~/.adrenalin/adrenalin.db`

### Test
- `dotnet test` - Run all tests
- `dotnet test --filter "FullyQualifiedName~TestClass.TestMethod"` - Run single test
- `dotnet test --filter "Category=Unit"` - Run tests by category

## Code Style Guidelines

### C# (.NET 9.0 + Avalonia + ReactiveUI)
- **Target**: .NET 9.0 with nullable types and implicit usings enabled
- **Naming**: PascalCase for classes/properties/methods, camelCase with _ prefix for private fields
- **Imports**: System first, then third-party (Avalonia/ReactiveUI), then project namespaces
- **Async**: Use `async`/`await` with `Async` suffix; `Task.WhenAll` for concurrency
- **MVVM**: ReactiveUI with `ReactiveObject`, `ReactiveCommand`, `RaiseAndSetIfChanged`
- **Database**: Parameterized queries, `using` statements, null-coalescing for nullable columns
- **Error Handling**: Try-catch in services, `reader.IsDBNull()` checks, `?? (object)DBNull.Value`
