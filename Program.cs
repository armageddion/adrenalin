using Avalonia;
using Avalonia.ReactiveUI;
using Adrenalin;

BuildAvaloniaApp().StartWithClassicDesktopLifetime(args);

static AppBuilder BuildAvaloniaApp()
	=> AppBuilder.Configure<App>()
		.UsePlatformDetect()
		.UseReactiveUI()
		.LogToTrace();
