using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Adrenalin.Models;

/// <summary>
/// Represents a gym member with personal information, membership details, and contact information.
/// </summary>
public class Member
{
    /// <summary>
    /// Gets or sets the unique identifier for the member.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the member's first name.
    /// </summary>
    [JsonPropertyName("firstName")]
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the member's last name.
    /// </summary>
    [JsonPropertyName("lastName")]
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the member's email address.
    /// </summary>
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Gets or sets the member's phone number.
    /// </summary>
    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    /// <summary>
    /// Gets or sets the unique card identifier for the member.
    /// </summary>
    [JsonPropertyName("cardId")]
    public string CardId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the member's government identification number.
    /// </summary>
    [JsonPropertyName("govId")]
    public string? GovId { get; set; }

    /// <summary>
    /// Gets or sets the ID of the package associated with this member.
    /// </summary>
    public int? PackageId { get; set; }

    /// <summary>
    /// Gets or sets the expiration date of the member's package.
    /// </summary>
    public DateTime? ExpiresAt { get; set; }

    /// <summary>
    /// Gets or sets the base64-encoded image data for the member's photo.
    /// </summary>
    public string? Image { get; set; }

    /// <summary>
    /// Gets or sets additional notes about the member.
    /// </summary>
    public string? Notes { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the member was created.
    /// </summary>
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the member was last updated.
    /// </summary>
    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    /// <summary>
    /// Gets or sets the street address of the member.
    /// </summary>
    [JsonPropertyName("addressStreet")]
    public string? AddressStreet { get; set; }

    /// <summary>
    /// Gets or sets the street number of the member's address.
    /// </summary>
    [JsonPropertyName("addressNumber")]
    public string? AddressNumber { get; set; }

    /// <summary>
    /// Gets or sets the city of the member's address.
    /// </summary>
    [JsonPropertyName("addressCity")]
    public string? AddressCity { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the member requires a guardian.
    /// </summary>
    [JsonPropertyName("guardian")]
    public bool Guardian { get; set; }

    /// <summary>
    /// Gets or sets the first name of the member's guardian.
    /// </summary>
    [JsonPropertyName("guardianFirstName")]
    public string? GuardianFirstName { get; set; }

    /// <summary>
    /// Gets or sets the last name of the member's guardian.
    /// </summary>
    [JsonPropertyName("guardianLastName")]
    public string? GuardianLastName { get; set; }

    /// <summary>
    /// Gets or sets the government ID of the member's guardian.
    /// </summary>
    [JsonPropertyName("guardianGovId")]
    public string? GuardianGovId { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the member should receive notifications.
    /// </summary>
    [JsonPropertyName("notify")]
    public bool Notify { get; set; } = true;

    /// <summary>
    /// Gets or sets the year of birth of the member.
    /// </summary>
    [JsonPropertyName("yearOfBirth")]
    public int YearOfBirth { get; set; }

    /// <summary>
    /// Gets or sets the old package information (for migration purposes).
    /// </summary>
    public string? PackageOld { get; set; }

    /// <summary>
    /// Gets or sets the signature data as a byte array.
    /// </summary>
    [JsonPropertyName("signature")]
    [JsonConverter(typeof(SignatureConverter))]
    public byte[]? Signature { get; set; }

    /// <summary>
    /// Validates member data for registration.
    /// </summary>
    /// <param name="member">The member to validate.</param>
    /// <returns>A validation error message, or an empty string if the member data is valid.</returns>
    public static string ValidateForRegistration(Member member)
    {
        if (string.IsNullOrWhiteSpace(member.FirstName))
            return "First name is required";

        if (string.IsNullOrWhiteSpace(member.LastName))
            return "Last name is required";

        if (string.IsNullOrWhiteSpace(member.CardId))
            return "Card ID is required";

        if (member.YearOfBirth < 1900 || member.YearOfBirth > DateTime.Now.Year)
            return "Please enter a valid year of birth";

        if (member.Guardian && (string.IsNullOrWhiteSpace(member.GuardianFirstName) || string.IsNullOrWhiteSpace(member.GuardianLastName)))
            return "Guardian name is required when guardian is selected";

        return string.Empty;
    }
}

/// <summary>
/// Custom JSON converter for signature data that handles base64-encoded data URLs.
/// </summary>
public class SignatureConverter : JsonConverter<byte[]?>
{
    /// <summary>
    /// Reads and converts the JSON representation of signature data.
    /// </summary>
    /// <param name="reader">The reader to read from.</param>
    /// <param name="typeToConvert">The type to convert to.</param>
    /// <param name="options">The serializer options.</param>
    /// <returns>The converted byte array, or null if the data is invalid.</returns>
    public override byte[]? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
        {
            return null;
        }

        if (reader.TokenType == JsonTokenType.String)
        {
            var dataUrl = reader.GetString();
            if (string.IsNullOrEmpty(dataUrl))
            {
                return null;
            }

            try
            {
                // Data URL format: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
                if (!dataUrl.StartsWith("data:"))
                {
                    return null;
                }

                var base64Data = dataUrl.Split(',')[1];
                return Convert.FromBase64String(base64Data);
            }
            catch
            {
                return null;
            }
        }

        throw new JsonException("Expected string or null for signature");
    }

    /// <summary>
    /// Writes the byte array as a base64-encoded data URL.
    /// </summary>
    /// <param name="writer">The writer to write to.</param>
    /// <param name="value">The byte array to write.</param>
    /// <param name="options">The serializer options.</param>
    public override void Write(Utf8JsonWriter writer, byte[]? value, JsonSerializerOptions options)
    {
        if (value == null)
        {
            writer.WriteNullValue();
        }
        else
        {
            // Convert back to data URL for serialization if needed
            var base64 = Convert.ToBase64String(value);
            var dataUrl = $"data:image/png;base64,{base64}";
            writer.WriteStringValue(dataUrl);
        }
    }
}