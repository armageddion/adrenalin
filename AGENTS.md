# AGENTS.md - Development Guidelines for Adrenalin

## Build/Lint/Test Commands
- `dotnet build` - Build project
- `dotnet run` - Run application
- `dotnet format Adrenalin.csproj` - Format code and apply fixes
- `dotnet format --verify-no-changes` - Verify formatting
- `dotnet test` - Run all tests
- `dotnet test --filter "FullyQualifiedName~TestClass.TestMethod"` - Run single test
- `rm ~/.adrenalin/adrenalin.db` - Clear database

## Code Style Guidelines

### C# (.NET 9.0 + Avalonia + ReactiveUI)
- **Formatting**: Tabs for indentation, UTF-8, LF line endings
- **Naming**: PascalCase (classes/methods/properties), camelCase with _ (private fields)
- **Imports**: System → third-party (Avalonia/ReactiveUI) → project namespaces
- **Async**: `async`/`await` with `Async` suffix, `Task.WhenAll` for concurrency
- **MVVM**: ReactiveUI (`ReactiveObject`, `ReactiveCommand`, `RaiseAndSetIfChanged`)
- **Database**: Parameterized queries, `using` statements, `reader.IsDBNull()` checks
- **Error Handling**: Try-catch in services, `?? (object)DBNull.Value` for nullables
- **Documentation**: XML comments for public APIs

### JavaScript/TypeScript (Hono web server)
- **Modules**: ES modules with import/export
- **Framework**: Hono for routing, Node.js server
- **Styling**: Follow existing patterns in routes/ and views/
