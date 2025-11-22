using System;
using Xunit;
using Adrenalin.Services;
using Adrenalin.Models;
using System.Threading.Tasks;

namespace Adrenalin.Tests;

public class GymServiceTests
{
    [Fact]
    public async Task GymService_CanStoreAndRetrieveMemberWithSignature()
    {
        // Arrange - Use test service with in-memory DB
        var service = new TestHelpers.TestGymService();
        var testSignature = new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 }; // Mock PNG header

        var member = new Member
        {
            FirstName = "Signature",
            LastName = "Test",
            CardId = "SIG001",
            YearOfBirth = 1985,
            Signature = testSignature,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        // Act
        var memberId = await service.AddMemberAsync(member);
        Assert.True(memberId > 0, "Member should be added successfully");

        var retrievedMember = await service.GetMemberAsync(memberId);

        // Assert
        Assert.NotNull(retrievedMember);
        Assert.Equal("Signature", retrievedMember.FirstName);
        Assert.Equal(testSignature, retrievedMember.Signature);
    }
}