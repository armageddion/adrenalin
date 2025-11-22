using System;

namespace Adrenalin.Models;

/// <summary>
/// Represents a gym membership package with pricing and display information.
/// </summary>
public class Package
{
    /// <summary>
    /// Gets or sets the unique identifier for the package.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the package.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the price of the package in RSD.
    /// </summary>
    public decimal? Price { get; set; }

    /// <summary>
    /// Gets or sets the description of the package.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets the display order for sorting packages in the UI.
    /// </summary>
    public int? DisplayOrder { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the package was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }
}