using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Adrenalin.Services;
using Adrenalin.Models;
using Adrenalin.ViewModels;

namespace Adrenalin.Tests;

public static class TestHelpers
{
    // Test configuration service for tests
    public class TestConfigurationService : ConfigurationService
    {
        public TestConfigurationService() : base() { }
    }

    // Helper method to test form validation (since it's private in ViewModel)
    public static bool ValidateForm(RegisterViewModel vm)
    {
        if (string.IsNullOrWhiteSpace(vm.FirstName)) return false;
        if (string.IsNullOrWhiteSpace(vm.LastName)) return false;
        if (string.IsNullOrWhiteSpace(vm.CardId)) return false;
        if (vm.YearOfBirth < 1900 || vm.YearOfBirth > DateTime.Now.Year) return false;
        return true;
    }

    // Test service that uses in-memory database
    public class TestGymService : GymService
    {
        public TestGymService() : base(new TestConfigurationService()) { }
        private static readonly string TestConnectionString = $"Data Source=:memory:";
        public static SqliteConnection? _sharedConnection;
        private static bool _isInitialized = false;
        public static bool AddMemberCalled = false;
        public static bool TableInitialized = false;

        private async Task EnsureTestTableExistsAsync()
        {
            if (_isInitialized) return;

            _sharedConnection = new SqliteConnection(TestConnectionString);
            await _sharedConnection.OpenAsync();

            // Create tables using the same schema as the main application
            using var schemaCmd = _sharedConnection.CreateCommand();
            var schemaPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "Database", "schema.sql");
            var schema = await File.ReadAllTextAsync(schemaPath);
            schemaCmd.CommandText = schema;
            await schemaCmd.ExecuteNonQueryAsync();

            // Seed test data
            await SeedTestDatabaseAsync(_sharedConnection);

            _isInitialized = true;
            TableInitialized = true;
        }

        private async Task SeedTestDatabaseAsync(SqliteConnection conn)
        {
            // Clear existing data
            using var clearVisitsCmd = conn.CreateCommand();
            clearVisitsCmd.CommandText = "DELETE FROM visits";
            await clearVisitsCmd.ExecuteNonQueryAsync();

            // Minimal seed data for tests
            using var packageCmd = conn.CreateCommand();
            packageCmd.CommandText = @"
                INSERT OR REPLACE INTO packages (id, name, price, description, display_order) VALUES
                (1, 'Test Package', 1000, 'Test package for testing', 1);";
            await packageCmd.ExecuteNonQueryAsync();
        }

        // Override methods to use test database
        public new async Task<List<Member>> GetMembersAsync()
        {
            await EnsureTestTableExistsAsync();
            var members = new List<Member>();
            using var cmd = _sharedConnection!.CreateCommand();
            cmd.CommandText = "SELECT * FROM members ORDER BY updated_at DESC";
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                members.Add(MapToMember(reader));
            }
            return members;
        }

        public new async Task<int> AddMemberAsync(Member member)
        {
            AddMemberCalled = true;
            // Debug: This should be called
            System.Diagnostics.Debug.WriteLine("TestGymService.AddMemberAsync called");
            await EnsureTestTableExistsAsync();
            using var cmd = _sharedConnection!.CreateCommand();
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
            using var cmd2 = _sharedConnection!.CreateCommand();
            cmd2.CommandText = "SELECT last_insert_rowid()";
            var result = await cmd2.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public new async Task<Member?> GetMemberAsync(int id)
        {
            await EnsureTestTableExistsAsync();
            using var cmd = _sharedConnection!.CreateCommand();
            cmd.CommandText = "SELECT * FROM members WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", id);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return MapToMember(reader);
            }
            return null;
        }

        public new async Task<List<Package>> GetPackagesAsync()
        {
            await EnsureTestTableExistsAsync();
            var packages = new List<Package>();
            using var cmd = _sharedConnection!.CreateCommand();
            cmd.CommandText = "SELECT * FROM packages ORDER BY display_order ASC";
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                packages.Add(MapToPackage(reader));
            }
            return packages;
        }

        public override async Task<Member?> GetMemberByCardIdAsync(string cardId)
        {
            await EnsureTestTableExistsAsync();
            using var cmd = _sharedConnection!.CreateCommand();
            cmd.CommandText = "SELECT * FROM members WHERE card_id = @card_id";
            cmd.Parameters.AddWithValue("@card_id", cardId);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return MapToMember(reader);
            }
            return null;
        }

        public override async Task AddVisitAsync(int memberId)
        {
            await EnsureTestTableExistsAsync();
            using var cmd = _sharedConnection!.CreateCommand();
            cmd.CommandText = "INSERT INTO visits (member_id) VALUES (@member_id)";
            cmd.Parameters.AddWithValue("@member_id", memberId);
            await cmd.ExecuteNonQueryAsync();
        }

        public override async Task<List<Visit>> GetVisitsAsync()
        {
            await EnsureTestTableExistsAsync();
            var visits = new List<Visit>();
            using var cmd = _sharedConnection!.CreateCommand();
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

        public async Task ClearVisitsAsync()
        {
            await EnsureTestTableExistsAsync();
            using var cmd = _sharedConnection!.CreateCommand();
            cmd.CommandText = "DELETE FROM visits";
            await cmd.ExecuteNonQueryAsync();
        }
    }
}