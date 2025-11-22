# Adrenalin .NET Migration Plan

## Completed ✅
- Database models (Member, Package, Visit, Message)
- Basic MVVM architecture with ViewModels and Views
- CRUD operations for members, packages, and visits
- Dashboard with statistics
- Database schema and seed data
- Internationalization (i18n) System
- Camera Integration
- Settings Management
    - Settings ViewModel and View
    - Theme switching (light/dark mode) with persistence
    - Language selection
    - API key configuration for email service
- Theme compatibility fixes across all UI components
- Enhanced Member Details
    - Add member detail view with visit history
    - Display package information and expiry dates
    - Show guardian information when applicable
    - Dual-mode interface: read-only detail view and full edit mode
    - Package selection dropdown using ComboBox
    - Overlay confirmation dialog with auto-focus for deletions
    - Immediate UI updates for visit logging and list refresh
- Enhanced Member Details
    - Add member detail view with visit history
    - Display package information and expiry dates
    - Show guardian information when applicable
- Global Search Functionality
    - Implement search across members with keyboard shortcuts
    - Add search results display
    - Integrate with navigation
- Member Registration
    - Create registration form with signature pad placeholder
    - Implement signature capture functionality (placeholder)
    - Add form validation and submission
    - Integrate registration view into main navigation
- Setup Wizard
    - Create initial setup dialog
    - Database path selection
    - First-time configuration

## Remaining Requirements 📋

1. **Email Notifications (Cron Jobs)**
    - Implement background job system
    - Check for expiring packages
    - Send reminder emails

2. **Email Service**
    - Integrate Resend API for email sending
    - Add email templates
    - Handle API key storage securely

3. **Pagination**
    - Add pagination controls for members list
    - Add pagination for visits list
    - Implement load more functionality

## Implementation Notes
- Maintain consistency with existing MVVM patterns
- Follow Avalonia UI best practices
- Ensure proper error handling and user feedback
- Test all new features thoroughly
- Update AGENTS.md with new build/lint/test commands as needed
