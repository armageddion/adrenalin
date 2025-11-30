using Microsoft.Data.Sqlite;
using System;
using System.ComponentModel;
using System.IO;
using System.Runtime.CompilerServices;
using System.Text.Json;
using Adrenalin.Models;

namespace Adrenalin.Services;

/// <summary>
/// Service class for managing gym operations including members, packages, visits, and database interactions.
/// Provides CRUD operations and business logic for the gym management system.
/// </summary>
public class GymService
{
    private readonly ConfigurationService _configurationService;
    private readonly string _dbPath;
    private readonly string _connectionString;

    public GymService(ConfigurationService configurationService)
    {
        _configurationService = configurationService;
        _dbPath = _configurationService.GetDatabasePath();
        _connectionString = $"Data Source={_dbPath}";
    }



    private class SettingsData
    {
        public string? DatabasePath { get; set; }
    }



    private async Task EnsureTableExistsAsync()
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();

        // Enable Write-Ahead Logging for better concurrency
        using var walCmd = conn.CreateCommand();
        walCmd.CommandText = "PRAGMA journal_mode = WAL;";
        await walCmd.ExecuteNonQueryAsync();

        // Check if tables already exist (e.g., from uploaded database)
        using var checkCmd = conn.CreateCommand();
        checkCmd.CommandText = "SELECT name FROM sqlite_master WHERE type='table' AND name='members'";
        var result = await checkCmd.ExecuteScalarAsync();

        if (result == null)
        {
            // Create tables
            using var schemaCmd = conn.CreateCommand();
            string schemaPath = Path.Combine(AppContext.BaseDirectory, "Database", "schema.sql");
            string schema = await File.ReadAllTextAsync(schemaPath);
            schemaCmd.CommandText = schema;
            await schemaCmd.ExecuteNonQueryAsync();
        }
        else
        {
            // Tables exist, check for missing columns and add them
            await EnsureColumnsExistAsync(conn);
        }
    }

    private async Task EnsureColumnsExistAsync(SqliteConnection conn)
    {
        // Check if signature column exists in members table
        using var checkCmd = conn.CreateCommand();
        checkCmd.CommandText = "PRAGMA table_info(members)";
        using var reader = await checkCmd.ExecuteReaderAsync();

        bool hasSignature = false;
        while (await reader.ReadAsync())
        {
            var columnName = reader.GetString(1);
            if (columnName == "signature")
            {
                hasSignature = true;
                break;
            }
        }

        if (!hasSignature)
        {
            // Add signature column
            using var alterCmd = conn.CreateCommand();
            alterCmd.CommandText = "ALTER TABLE members ADD COLUMN signature BLOB";
            await alterCmd.ExecuteNonQueryAsync();
        }
    }

    /// <summary>
    /// Initializes the database by ensuring tables exist.
    /// </summary>
    public async Task InitializeAsync()
    {
        var dbDirectory = Path.GetDirectoryName(_dbPath);
        if (!string.IsNullOrEmpty(dbDirectory))
        {
            Directory.CreateDirectory(dbDirectory);
        }

        await EnsureTableExistsAsync();
    }



    /// <summary>
    /// Checks if the database is initialized and contains data.
    /// </summary>
    /// <returns>True if the database exists and contains member data, false otherwise.</returns>
    public async Task<bool> IsDatabaseInitializedAsync()
    {
        try
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            // Check if tables exist
            using var checkCmd = conn.CreateCommand();
            checkCmd.CommandText = "SELECT name FROM sqlite_master WHERE type='table' AND name='members'";
            var result = await checkCmd.ExecuteScalarAsync();
            if (result == null) return false;

            // Check if has data
            using var countCmd = conn.CreateCommand();
            countCmd.CommandText = "SELECT COUNT(*) FROM members";
            var count = Convert.ToInt32(await countCmd.ExecuteScalarAsync());
            return count > 0;
        }
        catch
        {
            return false;
        }
    }



    // Members
    /// <summary>
    /// Retrieves all members from the database, ordered by last update time.
    /// </summary>
    /// <returns>A list of all members.</returns>
    public async Task<List<Member>> GetMembersAsync()
    {
        var members = new List<Member>();
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM members ORDER BY updated_at DESC";
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            members.Add(MapToMember(reader));
        }
        return members;
    }

    public async Task<List<Member>> GetMembersPaginatedAsync(int page, int limit)
    {
        var members = new List<Member>();
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM members ORDER BY updated_at DESC LIMIT @limit OFFSET @offset";
        cmd.Parameters.AddWithValue("@limit", limit);
        cmd.Parameters.AddWithValue("@offset", (page - 1) * limit);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            members.Add(MapToMember(reader));
        }
        return members;
    }

    public async Task<int> GetMembersCountAsync()
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT COUNT(*) as count FROM members";
        var result = await cmd.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task<Member?> GetMemberAsync(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM members WHERE id = @id";
        cmd.Parameters.AddWithValue("@id", id);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return MapToMember(reader);
        }
        return null;
    }

    public virtual async Task<Member?> GetMemberByCardIdAsync(string cardId)
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM members WHERE card_id = @cardId";
        cmd.Parameters.AddWithValue("@cardId", cardId);

        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return MapToMember(reader);
        }
        return null;
    }

    public async Task<List<Member>> SearchMembersAsync(string query)
    {
        var members = new List<Member>();
        var words = query.Trim().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
        if (words.Length == 0) return members;

        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();

        var conditions = new List<string>();
        var paramIndex = 0;
        foreach (var word in words)
        {
            var wordParam = $"%{word}%";
            conditions.Add($"(first_name LIKE @param{paramIndex} OR last_name LIKE @param{paramIndex + 1} OR card_id LIKE @param{paramIndex + 2})");
            cmd.Parameters.AddWithValue($"@param{paramIndex}", wordParam);
            cmd.Parameters.AddWithValue($"@param{paramIndex + 1}", wordParam);
            cmd.Parameters.AddWithValue($"@param{paramIndex + 2}", wordParam);
            paramIndex += 3;
        }

        cmd.CommandText = $"SELECT * FROM members WHERE {string.Join(" AND ", conditions)} ORDER BY updated_at DESC";

        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            members.Add(MapToMember(reader));
        }
        return members;
    }

    /// <summary>
    /// Adds a new member to the database.
    /// </summary>
    /// <param name="member">The member to add.</param>
    /// <returns>The ID of the newly created member.</returns>
    public async Task<int> AddMemberAsync(Member member)
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO members (first_name, last_name, email, phone, card_id, gov_id, package_id, expires_at, image, notes, address_street, address_number, address_city, guardian, guardian_first_name, guardian_last_name, guardian_gov_id, notify, year_of_birth, signature)
            VALUES (@first_name, @last_name, @email, @phone, @card_id, @gov_id, @package_id, @expires_at, @image, @notes, @address_street, @address_number, @address_city, @guardian, @guardian_first_name, @guardian_last_name, @guardian_gov_id, @notify, @year_of_birth, @signature)";

        cmd.Parameters.AddWithValue("@first_name", member.FirstName);
        cmd.Parameters.AddWithValue("@last_name", member.LastName);
        cmd.Parameters.AddWithValue("@email", member.Email ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@phone", member.Phone ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@card_id", member.CardId);
        cmd.Parameters.AddWithValue("@gov_id", member.GovId ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@package_id", member.PackageId ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@expires_at", member.ExpiresAt ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@image", member.Image ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@notes", member.Notes ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@address_street", member.AddressStreet ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@address_number", member.AddressNumber ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@address_city", member.AddressCity ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@guardian", member.Guardian);
        cmd.Parameters.AddWithValue("@guardian_first_name", member.GuardianFirstName ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@guardian_last_name", member.GuardianLastName ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@guardian_gov_id", member.GuardianGovId ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@notify", member.Notify);
        cmd.Parameters.AddWithValue("@year_of_birth", member.YearOfBirth);
        cmd.Parameters.AddWithValue("@signature", member.Signature ?? (object)DBNull.Value);

        await cmd.ExecuteNonQueryAsync();
        using var cmd2 = conn.CreateCommand();
        cmd2.CommandText = "SELECT last_insert_rowid()";
        var result = await cmd2.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    /// <summary>
    /// Updates an existing member in the database.
    /// </summary>
    /// <param name="id">The ID of the member to update.</param>
    /// <param name="member">The updated member data.</param>
    public async Task UpdateMemberAsync(int id, Member member)
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            UPDATE members SET
                first_name = @first_name,
                last_name = @last_name,
                email = @email,
                phone = @phone,
                card_id = @card_id,
                gov_id = @gov_id,
                package_id = @package_id,
                expires_at = @expires_at,
                image = @image,
                notes = @notes,
                address_street = @address_street,
                address_number = @address_number,
                address_city = @address_city,
                guardian = @guardian,
                guardian_first_name = @guardian_first_name,
                guardian_last_name = @guardian_last_name,
                guardian_gov_id = @guardian_gov_id,
                notify = @notify,
                year_of_birth = @year_of_birth,
                signature = @signature,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = @id";

        cmd.Parameters.AddWithValue("@id", id);
        cmd.Parameters.AddWithValue("@first_name", member.FirstName);
        cmd.Parameters.AddWithValue("@last_name", member.LastName);
        cmd.Parameters.AddWithValue("@email", member.Email ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@phone", member.Phone ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@card_id", member.CardId);
        cmd.Parameters.AddWithValue("@gov_id", member.GovId ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@package_id", member.PackageId ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@expires_at", member.ExpiresAt ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@image", member.Image ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@notes", member.Notes ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@address_street", member.AddressStreet ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@address_number", member.AddressNumber ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@address_city", member.AddressCity ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@guardian", member.Guardian);
        cmd.Parameters.AddWithValue("@guardian_first_name", member.GuardianFirstName ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@guardian_last_name", member.GuardianLastName ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@guardian_gov_id", member.GuardianGovId ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@notify", member.Notify);
        cmd.Parameters.AddWithValue("@year_of_birth", member.YearOfBirth);
        cmd.Parameters.AddWithValue("@signature", member.Signature ?? (object)DBNull.Value);

        await cmd.ExecuteNonQueryAsync();
    }

    /// <summary>
    /// Deletes a member from the database.
    /// </summary>
    /// <param name="id">The ID of the member to delete.</param>
    public async Task DeleteMemberAsync(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "DELETE FROM members WHERE id = @id";
        cmd.Parameters.AddWithValue("@id", id);
        await cmd.ExecuteNonQueryAsync();
    }

    // Packages
    /// <summary>
    /// Retrieves all packages from the database, ordered by display order.
    /// </summary>
    /// <returns>A list of all packages.</returns>
    public async Task<List<Package>> GetPackagesAsync()
    {
        var packages = new List<Package>();
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM packages ORDER BY display_order ASC";
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            packages.Add(MapToPackage(reader));
        }
        return packages;
    }

    /// <summary>
    /// Adds a new package to the database.
    /// </summary>
    /// <param name="package">The package to add.</param>
    /// <returns>The ID of the newly created package.</returns>
    public async Task<int> AddPackageAsync(Package package)
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "INSERT INTO packages (name, price, description, display_order) VALUES (@name, @price, @description, @display_order)";
        cmd.Parameters.AddWithValue("@name", package.Name);
        cmd.Parameters.AddWithValue("@price", package.Price ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@description", package.Description ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@display_order", package.DisplayOrder ?? (object)DBNull.Value);
        await cmd.ExecuteNonQueryAsync();
        using var cmd2 = conn.CreateCommand();
        cmd2.CommandText = "SELECT last_insert_rowid()";
        var result = await cmd2.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task UpdatePackageAsync(int id, Package package)
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "UPDATE packages SET name = @name, price = @price, description = @description, display_order = @display_order WHERE id = @id";
        cmd.Parameters.AddWithValue("@id", id);
        cmd.Parameters.AddWithValue("@name", package.Name);
        cmd.Parameters.AddWithValue("@price", package.Price ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@description", package.Description ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@display_order", package.DisplayOrder ?? (object)DBNull.Value);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task DeletePackageAsync(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "DELETE FROM packages WHERE id = @id";
        cmd.Parameters.AddWithValue("@id", id);
        await cmd.ExecuteNonQueryAsync();
    }

    // Visits
    public virtual async Task<List<Visit>> GetVisitsAsync()
    {
        var visits = new List<Visit>();
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT v.*, m.first_name, m.last_name
            FROM visits v
            JOIN members m ON v.member_id = m.id
            ORDER BY v.created_at DESC";
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            visits.Add(MapToVisit(reader));
        }
        return visits;
    }

    public async Task<List<Visit>> GetVisitsPaginatedAsync(int page, int limit)
    {
        var visits = new List<Visit>();
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT v.*, m.first_name, m.last_name
            FROM visits v
            JOIN members m ON v.member_id = m.id
            ORDER BY v.created_at DESC
            LIMIT @limit OFFSET @offset";
        cmd.Parameters.AddWithValue("@limit", limit);
        cmd.Parameters.AddWithValue("@offset", (page - 1) * limit);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            visits.Add(MapToVisit(reader));
        }
        return visits;
    }

    public async Task<int> GetVisitsCountAsync()
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT COUNT(*) as count FROM visits";
        var result = await cmd.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task<List<Visit>> GetVisitsByMemberIdAsync(int memberId)
    {
        var visits = new List<Visit>();
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT v.*, m.first_name, m.last_name
            FROM visits v
            JOIN members m ON v.member_id = m.id
            WHERE v.member_id = @member_id
            ORDER BY v.created_at DESC";
        cmd.Parameters.AddWithValue("@member_id", memberId);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            visits.Add(MapToVisit(reader));
        }
        return visits;
    }

    /// <summary>
    /// Records a new visit for a member.
    /// </summary>
    /// <param name="memberId">The ID of the member who visited.</param>
    public virtual async Task AddVisitAsync(int memberId)
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "INSERT INTO visits (member_id) VALUES (@member_id)";
        cmd.Parameters.AddWithValue("@member_id", memberId);
        await cmd.ExecuteNonQueryAsync();

        // Update member's updated_at
        using var updateCmd = conn.CreateCommand();
        updateCmd.CommandText = "UPDATE members SET updated_at = CURRENT_TIMESTAMP WHERE id = @id";
        updateCmd.Parameters.AddWithValue("@id", memberId);
        await updateCmd.ExecuteNonQueryAsync();
    }

    public async Task DeleteVisitAsync(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "DELETE FROM visits WHERE id = @id";
        cmd.Parameters.AddWithValue("@id", id);
        await cmd.ExecuteNonQueryAsync();
    }

    // Dashboard stats
    public async Task<int> GetNewMembersLast30DaysAsync()
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT COUNT(*) as count FROM members WHERE created_at >= date('now', '-30 days')";
        var result = await cmd.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task<int> GetVisitsTodayAsync()
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT COUNT(*) as count FROM visits WHERE date(created_at) = date('now')";
        var result = await cmd.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task<int> GetVisitsLast7DaysAsync()
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT COUNT(*) as count FROM visits WHERE created_at >= date('now', '-7 days')";
        var result = await cmd.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task<int> GetVisitsPrevious7DaysAsync()
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT COUNT(*) as count FROM visits WHERE created_at BETWEEN date('now', '-14 days') AND date('now', '-7 days')";
        var result = await cmd.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task<int> GetVisitsLast30DaysAsync()
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT COUNT(*) as count FROM visits WHERE created_at >= date('now', '-30 days')";
        var result = await cmd.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task<int> GetVisitsPrevious30DaysAsync()
    {
        using var conn = new SqliteConnection(_connectionString);
        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT COUNT(*) as count FROM visits WHERE created_at BETWEEN date('now', '-60 days') AND date('now', '-30 days')";
        var result = await cmd.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    // Helper methods
    private byte[]? GetSignatureSafe(SqliteDataReader reader)
    {
        try
        {
            var ordinal = reader.GetOrdinal("signature");
            return reader.IsDBNull(ordinal) ? null : (byte[])reader.GetValue(ordinal);
        }
        catch (ArgumentOutOfRangeException)
        {
            // Column doesn't exist
            return null;
        }
    }

    protected Member MapToMember(SqliteDataReader reader)
    {
        return new Member
        {
            Id = reader.GetInt32(reader.GetOrdinal("id")),
            FirstName = reader.GetString(reader.GetOrdinal("first_name")),
            LastName = reader.GetString(reader.GetOrdinal("last_name")),
            Email = reader.IsDBNull(reader.GetOrdinal("email")) ? null : reader.GetString(reader.GetOrdinal("email")),
            Phone = reader.IsDBNull(reader.GetOrdinal("phone")) ? null : reader.GetString(reader.GetOrdinal("phone")),
            CardId = reader.GetString(reader.GetOrdinal("card_id")),
            GovId = reader.IsDBNull(reader.GetOrdinal("gov_id")) ? null : reader.GetString(reader.GetOrdinal("gov_id")),
            PackageId = reader.IsDBNull(reader.GetOrdinal("package_id")) ? null : reader.GetInt32(reader.GetOrdinal("package_id")),
            ExpiresAt = reader.IsDBNull(reader.GetOrdinal("expires_at")) ? null : reader.GetDateTime(reader.GetOrdinal("expires_at")),
            Image = reader.IsDBNull(reader.GetOrdinal("image")) ? null : reader.GetString(reader.GetOrdinal("image")),
            Notes = reader.IsDBNull(reader.GetOrdinal("notes")) ? null : reader.GetString(reader.GetOrdinal("notes")),
            CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
            UpdatedAt = reader.GetDateTime(reader.GetOrdinal("updated_at")),
            AddressStreet = reader.IsDBNull(reader.GetOrdinal("address_street")) ? null : reader.GetString(reader.GetOrdinal("address_street")),
            AddressNumber = reader.IsDBNull(reader.GetOrdinal("address_number")) ? null : reader.GetString(reader.GetOrdinal("address_number")),
            AddressCity = reader.IsDBNull(reader.GetOrdinal("address_city")) ? null : reader.GetString(reader.GetOrdinal("address_city")),
            Guardian = reader.IsDBNull(reader.GetOrdinal("guardian")) ? false : reader.GetBoolean(reader.GetOrdinal("guardian")),
            GuardianFirstName = reader.IsDBNull(reader.GetOrdinal("guardian_first_name")) ? null : reader.GetString(reader.GetOrdinal("guardian_first_name")),
            GuardianLastName = reader.IsDBNull(reader.GetOrdinal("guardian_last_name")) ? null : reader.GetString(reader.GetOrdinal("guardian_last_name")),
            GuardianGovId = reader.IsDBNull(reader.GetOrdinal("guardian_gov_id")) ? null : reader.GetString(reader.GetOrdinal("guardian_gov_id")),
            Notify = reader.IsDBNull(reader.GetOrdinal("notify")) ? true : reader.GetBoolean(reader.GetOrdinal("notify")),
            YearOfBirth = reader.IsDBNull(reader.GetOrdinal("year_of_birth")) ? 0 : reader.GetInt32(reader.GetOrdinal("year_of_birth")),
            PackageOld = reader.IsDBNull(reader.GetOrdinal("package_old")) ? null : reader.GetString(reader.GetOrdinal("package_old")),
            Signature = GetSignatureSafe(reader)
        };
    }

    protected Package MapToPackage(SqliteDataReader reader)
    {
        return new Package
        {
            Id = reader.GetInt32(reader.GetOrdinal("id")),
            Name = reader.GetString(reader.GetOrdinal("name")),
            Price = reader.IsDBNull(reader.GetOrdinal("price")) ? null : reader.GetDecimal(reader.GetOrdinal("price")),
            Description = reader.IsDBNull(reader.GetOrdinal("description")) ? null : reader.GetString(reader.GetOrdinal("description")),
            DisplayOrder = reader.IsDBNull(reader.GetOrdinal("display_order")) ? null : reader.GetInt32(reader.GetOrdinal("display_order")),
            CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
        };
    }

    protected Visit MapToVisit(SqliteDataReader reader)
    {
        return new Visit
        {
            Id = reader.GetInt32(reader.GetOrdinal("id")),
            MemberId = reader.GetInt32(reader.GetOrdinal("member_id")),
            VisitDate = reader.IsDBNull(reader.GetOrdinal("visit_date")) ? null : reader.GetDateTime(reader.GetOrdinal("visit_date")),
            Notes = reader.IsDBNull(reader.GetOrdinal("notes")) ? null : reader.GetString(reader.GetOrdinal("notes")),
            CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
            MemberFirstName = reader.IsDBNull(reader.GetOrdinal("first_name")) ? null : reader.GetString(reader.GetOrdinal("first_name")),
            MemberLastName = reader.IsDBNull(reader.GetOrdinal("last_name")) ? null : reader.GetString(reader.GetOrdinal("last_name"))
        };
    }
}