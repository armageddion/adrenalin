using System;
using System.Threading.Tasks;
using System.Timers;
using Adrenalin.Services;
using ReactiveUI;

namespace Adrenalin.Services;

/// <summary>
/// Service for handling barcode scanner input to log member visits.
/// Buffers numeric input and logs visits when 8-12 digits are received within 1 second.
/// </summary>
public class BarcodeScannerService
{
	private readonly GymService _gymService;
	private readonly System.Timers.Timer _resetTimer;
	private string _buffer = string.Empty;

	public BarcodeScannerService(GymService gymService)
	{
		_gymService = gymService;
		_resetTimer = new System.Timers.Timer(1000); // 1 second
		_resetTimer.Elapsed += OnResetTimerElapsed;
		_resetTimer.AutoReset = false; // Only fire once
	}

	/// <summary>
	/// Adds a digit to the buffer. If buffer reaches 8-12 digits, attempts to log a visit.
	/// </summary>
	/// <param name="digit">The digit to add (0-9).</param>
	public async void AddDigit(char digit)
	{
		if (!char.IsDigit(digit)) return;

		_buffer += digit;
		_resetTimer.Stop();
		_resetTimer.Start();

		if (_buffer.Length >= 8 && _buffer.Length <= 12)
		{
			await ProcessBarcodeAsync(_buffer);
			ResetBuffer();
		}
	}

	private async Task ProcessBarcodeAsync(string barcode)
	{
		try
		{
			var member = await _gymService.GetMemberByCardIdAsync(barcode);
			if (member != null)
			{
				await _gymService.AddVisitAsync(member.Id);
				// Send message to open member details
				MessageBus.Current.SendMessage(("BarcodeVisitLogged", member.Id));
			}
			else
			{
				// Member not found, perhaps log or notify
			}
		}
		catch (Exception)
		{
			// Handle error, perhaps log
		}
	}

	private void OnResetTimerElapsed(object? sender, ElapsedEventArgs e)
	{
		ResetBuffer();
	}

	private void ResetBuffer()
	{
		_buffer = string.Empty;
		_resetTimer.Stop();
	}
}
