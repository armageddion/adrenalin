using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Avalonia.Media.Imaging;
using Avalonia.Platform.Storage;
using FlashCap;
using Avalonia.Threading;
using AvaloniaBitmap = Avalonia.Media.Imaging.Bitmap;
using Serilog;

namespace Adrenalin.Services;

/// <summary>
/// Interface for camera operations including photo capture and preview.
/// </summary>
public interface ICameraService
{
	/// <summary>
	/// Captures a photo from the camera.
	/// </summary>
	/// <returns>The captured bitmap, or null if capture failed.</returns>
	Task<AvaloniaBitmap?> CapturePhotoFromCameraAsync();

	/// <summary>
	/// Opens a file picker to select a photo from the file system.
	/// </summary>
	/// <returns>The selected bitmap, or null if no file was selected.</returns>
	Task<AvaloniaBitmap?> SelectPhotoFromFileAsync();

	/// <summary>
	/// Starts camera preview with a callback for frame updates.
	/// </summary>
	/// <param name="onFrameCaptured">Action to call when a new frame is captured.</param>
	Task StartCameraPreviewAsync(Action<AvaloniaBitmap> onFrameCaptured);

	/// <summary>
	/// Stops the camera preview.
	/// </summary>
	Task StopCameraPreviewAsync();

	/// <summary>
	/// Converts a bitmap to a base64-encoded string.
	/// </summary>
	/// <param name="bitmap">The bitmap to convert.</param>
	/// <returns>The base64-encoded string representation of the bitmap.</returns>
	string ConvertBitmapToBase64(AvaloniaBitmap bitmap);

	/// <summary>
	/// Gets a value indicating whether a camera is available on the system.
	/// </summary>
	bool IsCameraAvailable { get; }
}

/// <summary>
/// Implementation of camera service using FlashCap for camera operations.
/// </summary>
public class CameraService : ICameraService, IDisposable
{
	private CaptureDevice? _currentDevice;
	private Action<AvaloniaBitmap>? _frameCallback;
	private bool _isPreviewRunning;

	public bool IsCameraAvailable => CheckCameraAvailability();

	private bool CheckCameraAvailability()
	{
		try
		{
			var devices = new CaptureDevices();
			var descriptors = devices.EnumerateDescriptors().ToList();
			Log.Debug("Camera check: Found {DeviceCount} devices", descriptors.Count);
			return descriptors.Any();
		}
		catch (Exception ex)
		{
			Log.Warning(ex, "Camera check failed");
			return false;
		}
	}

	public async Task StartCameraPreviewAsync(Action<AvaloniaBitmap> onFrameCaptured)
	{
		if (_currentDevice != null || _isPreviewRunning)
			return;

		try
		{
			Log.Information("Starting camera preview...");
			var devices = new CaptureDevices();
			var descriptors = devices.EnumerateDescriptors().ToList();
			Log.Debug("Found {DeviceCount} camera devices for preview", descriptors.Count);

			if (!descriptors.Any())
			{
				Log.Warning("No camera devices for preview");
				return;
			}

			// Find a device with characteristics
			var descriptor = descriptors.FirstOrDefault(d => d.Characteristics.Any());
			if (descriptor == null)
			{
				Log.Warning("No camera devices with supported characteristics");
				return;
			}
			Log.Debug("Using camera for preview: {Name}", descriptor.Name);

			// Log all characteristics for debugging
			Log.Debug("Available characteristics:");
			foreach (var charac in descriptor.Characteristics)
			{
				Log.Debug("  {Width}x{Height} @ {FramesPerSecond} fps, Format: {PixelFormat}", charac.Width, charac.Height, charac.FramesPerSecond, charac.PixelFormat);
			}

			// For now, try to use any available characteristic
			// TODO: Filter out truly unsupported formats
			var characteristic = descriptor.Characteristics[0];
			Log.Debug("Using characteristic: {Width}x{Height} @ {PixelFormat}", characteristic.Width, characteristic.Height, characteristic.PixelFormat);

			_frameCallback = onFrameCaptured;
			_isPreviewRunning = true;

			try
			{
				Log.Debug("Attempting to open camera with {Width}x{Height} @ {PixelFormat}", characteristic.Width, characteristic.Height, characteristic.PixelFormat);
				_currentDevice = await descriptor.OpenAsync(
					characteristic,
					async bufferScope =>
					{
						if (_isPreviewRunning && _frameCallback != null)
						{
							try
							{
								Log.Debug("Received frame buffer");
								var imageData = bufferScope.Buffer.CopyImage();
								Log.Debug("Image data size: {Length} bytes", imageData.Length);
								using var stream = new MemoryStream(imageData);
								var bitmap = new AvaloniaBitmap(stream);
								Log.Debug("Bitmap created successfully");

								// Update UI on main thread
								await Dispatcher.UIThread.InvokeAsync(() =>
								{
									_frameCallback(bitmap);
								});
							}
							catch (Exception ex)
							{
								Log.Error(ex, "Preview frame error");
							}
						}

					});

				Log.Debug("Camera opened successfully, starting capture...");
				await _currentDevice.StartAsync();
				Log.Debug("Camera capture started");
			}
			catch (Exception ex)
			{
				Log.Error(ex, "Failed to open/start camera");
				_isPreviewRunning = false;
				return;
			}

			Log.Information("Camera preview started successfully");
		}
		catch (Exception ex)
		{
			Log.Error(ex, "Camera preview failed");
			_isPreviewRunning = false;
			throw;
		}
	}

	public async Task StopCameraPreviewAsync()
	{
		_isPreviewRunning = false;
		if (_currentDevice != null)
		{
			await _currentDevice.StopAsync();
			_currentDevice = null;
		}
		_frameCallback = null;
	}

	public async Task<AvaloniaBitmap?> CapturePhotoFromCameraAsync()
	{
		try
		{
			Log.Debug("Attempting to capture photo from camera...");
			var devices = new CaptureDevices();
			var descriptors = devices.EnumerateDescriptors().ToList();
			Log.Debug("Found {Count} camera devices", descriptors.Count);

			if (!descriptors.Any())
			{
				Log.Warning("No camera devices found");
				return null;
			}

			// Find a device with characteristics
			var descriptor = descriptors.FirstOrDefault(d => d.Characteristics.Any());
			if (descriptor == null)
			{
				Log.Warning("No camera devices with supported characteristics");
				return null;
			}
			Log.Debug("Using camera: {Name}", descriptor.Name);

			// Log all characteristics for debugging
			Log.Debug("Available characteristics:");
			foreach (var charac in descriptor.Characteristics)
			{
				Log.Debug("  {Width}x{Height} @ {FramesPerSecond} fps, Format: {PixelFormat}", charac.Width, charac.Height, charac.FramesPerSecond, charac.PixelFormat);
			}

			// For now, try to use any available characteristic
			// TODO: Filter out truly unsupported formats
			var characteristic = descriptor.Characteristics[0];
			Log.Debug("Using characteristic: {Width}x{Height} @ {PixelFormat}", characteristic.Width, characteristic.Height, characteristic.PixelFormat);

			var tcs = new TaskCompletionSource<AvaloniaBitmap>();

			using var device = await descriptor.OpenAsync(
				characteristic,
				bufferScope =>
				{
					if (!tcs.Task.IsCompleted)
					{
						try
						{
							var imageData = bufferScope.Buffer.CopyImage();
							Log.Debug("Image data size: {Length} bytes", imageData.Length);
							using var stream = new MemoryStream(imageData);
							var bitmap = new AvaloniaBitmap(stream);
							Log.Debug("Bitmap created successfully");
							tcs.SetResult(bitmap);
						}
						catch (Exception ex)
						{
							Log.Error(ex, "Capture error");
							tcs.SetException(ex);
						}
					}
					return Task.CompletedTask;
				});

			// Wait for the first frame with a timeout
			var timeoutTask = Task.Delay(5000); // 5 second timeout
			var completedTask = await Task.WhenAny(tcs.Task, timeoutTask);

			if (completedTask == tcs.Task)
			{
				Log.Information("Photo captured successfully");
				return await tcs.Task;
			}
			else
			{
				Log.Warning("Photo capture timed out");
				tcs.TrySetCanceled();
				return null;
			}
		}
		catch (Exception ex)
		{
			Log.Error(ex, "Camera capture failed");
			return null;
		}
	}

	public async Task<AvaloniaBitmap?> SelectPhotoFromFileAsync()
	{
		try
		{
			var mainWindow = Avalonia.Application.Current?.ApplicationLifetime
				as Avalonia.Controls.ApplicationLifetimes.IClassicDesktopStyleApplicationLifetime;

			if (mainWindow?.MainWindow == null)
				return null;

			var storageProvider = mainWindow.MainWindow.StorageProvider;

			var options = new FilePickerOpenOptions
			{
				Title = "Select Photo",
				AllowMultiple = false,
				FileTypeFilter = new[]
				{
					new FilePickerFileType("Image Files")
					{
						Patterns = new[] { "*.jpg", "*.jpeg", "*.png", "*.bmp", "*.gif" },
						MimeTypes = new[] { "image/jpeg", "image/png", "image/bmp", "image/gif" }
					}
				}
			};

			var result = await storageProvider.OpenFilePickerAsync(options);

			if (result.Count > 0)
			{
				var file = result[0];
				await using var stream = await file.OpenReadAsync();
				return new AvaloniaBitmap(stream);
			}
		}
		catch (Exception ex)
		{
			Log.Error(ex, "File selection error");
		}

		return null;
	}

	public string ConvertBitmapToBase64(AvaloniaBitmap bitmap)
	{
		try
		{
			using var memoryStream = new MemoryStream();
			bitmap.Save(memoryStream);
			var imageBytes = memoryStream.ToArray();
			return Convert.ToBase64String(imageBytes);
		}
		catch
		{
			return string.Empty;
		}
	}

	public void Dispose()
	{
		_isPreviewRunning = false;
		if (_currentDevice != null)
		{
			_currentDevice.StopAsync().Wait();
			_currentDevice = null;
		}
		_frameCallback = null;
	}
}
