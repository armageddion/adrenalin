describe('Visit Popup E2E', () => {
	it('should not show popup on page load', () => {
		cy.visit('/') // Adjust to a specific page if needed
		// Assert that the popup is not visible initially
		cy.get('[x-show="showVisitPopup"]').should('not.be.visible')
	})

	it('should show popup after entering digits', () => {
		cy.visit('/') // Adjust to a specific page if needed
		// Simulate typing digits
		cy.get('body').type('123')
		// Assert that the popup becomes visible
		cy.get('[x-show="showVisitPopup"]').should('be.visible')
	})

	it('should hide popup when closed', () => {
		cy.visit('/') // Adjust to a specific page if needed
		// Simulate typing digits to show popup
		cy.get('body').type('123')
		cy.get('[x-show="showVisitPopup"]').should('be.visible')
		// Click the close button
		cy.get('button').contains('Cancel').click() // Adjust selector if needed
		// Assert that the popup is hidden
		cy.get('[x-show="showVisitPopup"]').should('not.be.visible')
	})

	it('should redirect to member profile for single match', () => {
		cy.visit('/')
		// Type a card_id that matches one member (e.g., '26030161526' for anja gvozdenovic)
		cy.get('body').type('26030161526')
		// Wait for the query to complete and check if redirected
		cy.url().should('include', '/members/') // Should redirect to /members/{id}
	})

	it('should redirect to new member form for no match', () => {
		cy.visit('/')
		// Type a card_id that doesn't match any member
		cy.get('body').type('99999999999')
		// Wait for the query to complete and check if redirected
		cy.url().should('include', '/members/new') // Should redirect to /members/new
	})

	it('should show dropdown for multiple matches', () => {
		cy.visit('/')
		// Clear any existing sessionStorage
		cy.window().then((win) => {
			win.sessionStorage.removeItem('visitQueryInProgress')
		})
		// Type digits that match multiple members (e.g., '2603016152' matches several card_ids)
		cy.get('body').type('2603016152')
		// Assert that the popup shows with results
		cy.get('[x-show="showVisitPopup"]').should('be.visible')
		// Check if results are displayed (assuming SearchResults component renders links or items)
		cy.get('[x-ref="cardResults"]').find('#member-list').should('exist')
	})

	it('should log only one visit when timeout triggers for exact match', () => {
		cy.visit('/')
		// Clear any existing sessionStorage
		cy.window().then((win) => {
			win.sessionStorage.removeItem('visitQueryInProgress')
		})
		// Type a card_id that matches exactly one member
		cy.get('body').type('26030161527')
		// Wait for the timeout to trigger (1.5 seconds) and redirect to happen
		cy.wait(2000) // Wait longer than the 1.5s timeout
		// Should be redirected to member profile
		cy.url().should('include', '/members/')
		// Check that the visit list shows exactly one visit (the automatic one)
		cy.get('#visits-list table tbody tr').should('have.length', 1)
		// Verify no duplicate visits were logged by checking the visit count
		cy.get('#visits-list table tbody tr')
			.first()
			.within(() => {
				cy.get('td').eq(2).should('contain', 'N/A') // Notes column should be N/A for automatic visits
			})
	})
})
