using System;

namespace Adrenalin.Models;

/// <summary>
/// Represents a gym visit by a member.
/// </summary>
public class Visit
{
	/// <summary>
	/// Gets or sets the unique identifier for the visit.
	/// </summary>
	public int Id { get; set; }

	/// <summary>
	/// Gets or sets the ID of the member who made the visit.
	/// </summary>
	public int MemberId { get; set; }

	/// <summary>
	/// Gets or sets the specific date of the visit (optional, defaults to CreatedAt date).
	/// </summary>
	public DateTime? VisitDate { get; set; }

	/// <summary>
	/// Gets or sets additional notes about the visit.
	/// </summary>
	public string? Notes { get; set; }

	/// <summary>
	/// Gets or sets the date and time when the visit was recorded.
	/// </summary>
	public DateTime CreatedAt { get; set; }

	// Joined properties

	/// <summary>
	/// Gets or sets the first name of the member (populated when joining with members table).
	/// </summary>
	public string? MemberFirstName { get; set; }

	/// <summary>
	/// Gets or sets the last name of the member (populated when joining with members table).
	/// </summary>
	public string? MemberLastName { get; set; }
}
