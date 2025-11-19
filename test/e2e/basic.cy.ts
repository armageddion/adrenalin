describe('Basic App Workflows', () => {
	beforeEach(() => {
		// Visit the app for each test
		cy.visit('http://localhost:3001')
	})

	it('should load the home page and display dashboard', () => {
		// Check if the page loads and has expected content
		cy.get('nav').should('be.visible')
		cy.get('h2').should('contain', 'Kontrolna tabla') // Dashboard title in Serbian
		cy.get('.bg-card').should('have.length.greaterThan', 0) // Stats cards
	})

	it('should navigate to members page', () => {
		// Navigate to members
		cy.visit('/members')
		// Check for member list or form
		cy.get('h2').should('contain', 'Članovi') // Members title
	})

	it('should perform a simple search', () => {
		// Use the search input in the nav
		cy.get('input[type="search"]').type('anja')
		cy.get('#search-results').should('be.visible')
		// Verify search results appear
		cy.get('#search-results').should('contain', 'anja')
	})

	it('should navigate to packages page', () => {
		cy.visit('/packages')
		cy.get('h2').should('contain', 'Paketi') // Packages title
	})

	it('should navigate to visits page', () => {
		cy.visit('/visits')
		cy.get('h2').should('contain', 'Nedavne posete') // Visits title
	})

	it('should navigate to settings page', () => {
		cy.visit('/settings')
		cy.get('h2').should('contain', 'Podešavanja') // Settings title
	})

	it('should navigate to register page and check form', () => {
		cy.visit('/register')
		cy.get('h3').should('contain', 'Member Registration')
		cy.get('input[name="first_name"]').should('be.visible')
		cy.get('input[name="last_name"]').should('be.visible')
		cy.get('input[name="card_id"]').should('be.visible')
		cy.get('button[type="submit"]').should('contain', 'Register')
	})

	it.skip('should perform search and log visit', () => {
		// Assuming there is a member with card_id 'CARD123' in the DB
		cy.get('input[type="search"]').type('CARD123')
		cy.get('#search-results').should('be.visible')
		// If exactly one result, it should log a visit
		// This may require seeded data
	})
})
