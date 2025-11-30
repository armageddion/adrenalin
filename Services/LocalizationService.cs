using System.Globalization;
using System.IO;
using System.Text.Json;

namespace Adrenalin.Services;

/// <summary>
/// Service for managing application localization and translations.
/// Supports multiple languages with fallback to English.
/// </summary>
public class LocalizationService
{
	private readonly Dictionary<string, Dictionary<string, string>> _translations = new();
	private string _currentLanguage = "en";

	public LocalizationService()
	{
		LoadTranslations();
		// Try to load saved language preference
		var savedLanguage = LoadSavedLanguage();
		SetLanguage(savedLanguage);
	}

	private void LoadTranslations()
	{
		// Load English translations
		var enTranslations = LoadTranslationFile("en");
		if (enTranslations != null)
		{
			_translations["en"] = enTranslations;
		}

		// Load Serbian translations
		var srTranslations = LoadTranslationFile("sr");
		if (srTranslations != null)
		{
			_translations["sr"] = srTranslations;
		}
	}

	private Dictionary<string, string> LoadTranslationFile(string language)
	{
		try
		{
			// Try to load from file system first (for development)
			var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Resources", "Locales", $"{language}.json");
			string json;

			if (File.Exists(filePath))
			{
				json = File.ReadAllText(filePath);
			}
			else
			{
				// Fall back to embedded resource
				var assembly = typeof(LocalizationService).Assembly;
				var resourceName = $"Adrenalin.Resources.Locales.{language}.json";

				using var stream = assembly.GetManifestResourceStream(resourceName);
				if (stream == null) return new Dictionary<string, string>();

				using var reader = new StreamReader(stream);
				json = reader.ReadToEnd();
			}

			var root = JsonSerializer.Deserialize<Dictionary<string, object>>(json);
			if (root == null) return new Dictionary<string, string>();

			var flattened = new Dictionary<string, string>();
			FlattenDictionary(root, "", flattened);
			return flattened;
		}
		catch
		{
			return new Dictionary<string, string>();
		}
	}

	private void FlattenDictionary(Dictionary<string, object> dict, string prefix, Dictionary<string, string> result)
	{
		foreach (var kvp in dict)
		{
			var key = string.IsNullOrEmpty(prefix) ? kvp.Key : $"{prefix}.{kvp.Key}";

			if (kvp.Value is string str)
			{
				result[key] = str;
			}
			else if (kvp.Value is Dictionary<string, object> nestedDict)
			{
				FlattenDictionary(nestedDict, key, result);
			}
			else if (kvp.Value is System.Text.Json.JsonElement jsonElement)
			{
				FlattenJsonElement(jsonElement, key, result);
			}
		}
	}

	private void FlattenJsonElement(System.Text.Json.JsonElement element, string prefix, Dictionary<string, string> result)
	{
		if (element.ValueKind == System.Text.Json.JsonValueKind.String)
		{
			result[prefix] = element.GetString() ?? "";
		}
		else if (element.ValueKind == System.Text.Json.JsonValueKind.Object)
		{
			foreach (var prop in element.EnumerateObject())
			{
				var key = string.IsNullOrEmpty(prefix) ? prop.Name : $"{prefix}.{prop.Name}";
				FlattenJsonElement(prop.Value, key, result);
			}
		}
	}

	/// <summary>
	/// Sets the current language for the application.
	/// </summary>
	/// <param name="language">The language code (e.g., "en", "sr").</param>
	public void SetLanguage(string language)
	{
		if (_translations.ContainsKey(language))
		{
			_currentLanguage = language;
			SaveLanguage(language);

			// Update current thread culture
			var culture = language == "sr" ? new CultureInfo("sr-Latn-RS") : new CultureInfo("en-US");
			CultureInfo.CurrentCulture = culture;
			CultureInfo.CurrentUICulture = culture;

			// Notify about language change
			LanguageChanged?.Invoke(this, language);
		}
	}

	private string LoadSavedLanguage()
	{
		try
		{
			var configPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "language.config");
			if (File.Exists(configPath))
			{
				return File.ReadAllText(configPath).Trim();
			}
		}
		catch
		{
			// Ignore errors and return default
		}
		return "en";
	}

	private void SaveLanguage(string language)
	{
		try
		{
			var configPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "language.config");
			File.WriteAllText(configPath, language);
		}
		catch
		{
			// Ignore errors
		}
	}

	/// <summary>
	/// Gets a localized string for the given key.
	/// </summary>
	/// <param name="key">The translation key.</param>
	/// <param name="args">Optional arguments for string formatting.</param>
	/// <returns>The localized string, or the key if not found.</returns>
	public string GetString(string key, params object[] args)
	{
		// Try current language first
		if (_translations.TryGetValue(_currentLanguage, out var translations) &&
			translations.TryGetValue(key, out var value))
		{
			return args.Length > 0 ? string.Format(value, args) : value;
		}

		// Fallback to English if translation not found
		if (_currentLanguage != "en" &&
			_translations.TryGetValue("en", out var enTranslations) &&
			enTranslations.TryGetValue(key, out var enValue))
		{
			return args.Length > 0 ? string.Format(enValue, args) : enValue;
		}

		// Return key if no translation found
		return key;
	}

	/// <summary>
	/// Gets the current language code.
	/// </summary>
	public string CurrentLanguage => _currentLanguage;

	/// <summary>
	/// Gets the available language codes.
	/// </summary>
	public IEnumerable<string> AvailableLanguages => _translations.Keys;

	/// <summary>
	/// Event raised when the language is changed.
	/// </summary>
	public event EventHandler<string>? LanguageChanged;
}
