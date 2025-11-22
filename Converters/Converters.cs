using Avalonia.Data.Converters;
using System;
using System.Globalization;

namespace Adrenalin.Converters;

/// <summary>
/// Converter for formatting decimal prices with RSD currency.
/// </summary>
public class PriceConverter : IValueConverter
{
    /// <summary>
    /// Gets the singleton instance of the PriceConverter.
    /// </summary>
    public static PriceConverter Instance { get; } = new();

    /// <summary>
    /// Converts a decimal value to a formatted price string with RSD currency.
    /// </summary>
    /// <param name="value">The decimal value to convert.</param>
    /// <param name="targetType">The target type (unused).</param>
    /// <param name="parameter">The converter parameter (unused).</param>
    /// <param name="culture">The culture (unused).</param>
    /// <returns>A formatted price string, or empty string if conversion fails.</returns>
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is decimal dec)
        {
            var europeanCulture = new CultureInfo("de-DE");
            return $"{dec.ToString("N2", europeanCulture)} RSD";
        }
        return string.Empty;
    }

    /// <summary>
    /// Converts a formatted price string back to a decimal value.
    /// </summary>
    /// <param name="value">The string value to convert back.</param>
    /// <param name="targetType">The target type (unused).</param>
    /// <param name="parameter">The converter parameter (unused).</param>
    /// <param name="culture">The culture (unused).</param>
    /// <returns>The parsed decimal value, or the original value if parsing fails.</returns>
    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is string str && decimal.TryParse(str.Replace(" RSD", "").Replace(".", "").Replace(",", "."), NumberStyles.Any, CultureInfo.InvariantCulture, out var result))
        {
            return result;
        }
        return value;
    }
}

/// <summary>
/// Converter that compares an integer value with a specified parameter using a given operation.
/// Parameter format: "op:value" where op is >, <, =, etc.
/// </summary>
public class Int32CompareConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is int intValue && parameter is string paramStr)
        {
            var parts = paramStr.Split(':');
            if (parts.Length == 2 && int.TryParse(parts[1], out int paramValue))
            {
                var op = parts[0];
                return op switch
                {
                    ">" => intValue > paramValue,
                    "<" => intValue < paramValue,
                    "=" => intValue == paramValue,
                    ">=" => intValue >= paramValue,
                    "<=" => intValue <= paramValue,
                    _ => false
                };
            }
        }
        return false;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}

/// <summary>
/// Converter that returns true if an integer value is greater than a specified parameter.
/// </summary>
public class Int32GreaterThanConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is int intValue && parameter is string paramStr && int.TryParse(paramStr, out int paramValue))
        {
            return intValue > paramValue;
        }
        return false;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}

/// <summary>
/// Converter that returns true if an integer value is less than a specified parameter.
/// </summary>
public class Int32LessThanConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is int intValue && parameter is string paramStr && int.TryParse(paramStr, out int paramValue))
        {
            return intValue < paramValue;
        }
        return false;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}

public class StringNotEmptyConverter : IValueConverter
{
    public static StringNotEmptyConverter Instance { get; } = new();

    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        return !string.IsNullOrWhiteSpace(value as string);
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}