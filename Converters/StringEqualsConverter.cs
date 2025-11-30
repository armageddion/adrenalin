using Avalonia.Data.Converters;
using System;
using System.Globalization;

namespace Adrenalin.Converters;

public class StringEqualsConverter : IValueConverter
{
	public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
	{
		if (value is string strValue && parameter is string strParameter)
		{
			return strValue == strParameter;
		}
		return false;
	}

	public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
	{
		throw new NotImplementedException();
	}
}
