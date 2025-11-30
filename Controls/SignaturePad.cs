using Avalonia;
using Avalonia.Controls;
using Avalonia.Media;
using Avalonia.Media.Imaging;
using Avalonia.Input;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Adrenalin.Controls
{
	/// <summary>
	/// A custom control for capturing digital signatures with touch or mouse input.
	/// </summary>
	public class SignaturePad : Border
	{
		private List<List<Point>> _strokes = new();
		private List<Point> _currentStroke = new();
		private bool _isDrawing = false;

		public static readonly StyledProperty<IBrush?> StrokeBrushProperty =
			AvaloniaProperty.Register<SignaturePad, IBrush?>(nameof(StrokeBrush), Brushes.Black);

		public static readonly StyledProperty<double> StrokeWidthProperty =
			AvaloniaProperty.Register<SignaturePad, double>(nameof(StrokeWidth), 2.0);

		/// <summary>
		/// Gets or sets the brush used for drawing signature strokes.
		/// </summary>
		public IBrush? StrokeBrush
		{
			get => GetValue(StrokeBrushProperty);
			set => SetValue(StrokeBrushProperty, value);
		}

		/// <summary>
		/// Gets or sets the width of signature strokes.
		/// </summary>
		public double StrokeWidth
		{
			get => GetValue(StrokeWidthProperty);
			set => SetValue(StrokeWidthProperty, value);
		}

		public SignaturePad()
		{
			Background = Brushes.White;
			BorderBrush = Brushes.Gray;
			BorderThickness = new Thickness(1);
			Height = 200;
			Width = 400;

			// Add a canvas as child to draw on
			var canvas = new Canvas
			{
				Background = Brushes.Transparent
			};
			Child = canvas;
		}

		protected override void OnPointerPressed(PointerPressedEventArgs e)
		{
			base.OnPointerPressed(e);

			_isDrawing = true;
			var point = e.GetPosition(this);
			_currentStroke = new List<Point> { point };

			e.Handled = true;
		}

		protected override void OnPointerMoved(PointerEventArgs e)
		{
			base.OnPointerMoved(e);

			if (!_isDrawing || Child is not Canvas canvas)
				return;

			var currentPoint = e.GetPosition(this);
			var lastPoint = _currentStroke.Last();

			_currentStroke.Add(currentPoint);

			// Draw a line segment from last point to current point
			var line = new Avalonia.Controls.Shapes.Line
			{
				StartPoint = lastPoint,
				EndPoint = currentPoint,
				Stroke = StrokeBrush,
				StrokeThickness = StrokeWidth
			};
			canvas.Children.Add(line);

			e.Handled = true;
		}

		protected override void OnPointerReleased(PointerReleasedEventArgs e)
		{
			base.OnPointerReleased(e);

			if (!_isDrawing)
				return;

			_isDrawing = false;
			if (_currentStroke.Count > 1)
			{
				_strokes.Add(_currentStroke);
			}
			_currentStroke = new List<Point>();
			e.Handled = true;
		}

		/// <summary>
		/// Clears all signature strokes from the pad.
		/// </summary>
		public void Clear()
		{
			_strokes.Clear();
			_currentStroke.Clear();
			if (Child is Canvas canvas)
			{
				canvas.Children.Clear();
			}
		}

		/// <summary>
		/// Gets the signature as a byte array.
		/// </summary>
		/// <returns>A byte array representing the signature as PNG, or null if no signature exists.</returns>
		public byte[]? GetSignatureBytes()
		{
			if (_strokes.Count == 0) return null;

			// 1. Determine bounds
			var width = this.Bounds.Width;
			var height = this.Bounds.Height;
			if (width <= 0 || height <= 0) { width = 400; height = 200; }

			// 2. Render to bitmap
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
	}
}
