describe('Guardian Functionality', () => {
	beforeEach(() => {
		// Visit the app for each test
		cy.visit('http://localhost:3001')
	})

	describe('Member Form Guardian', () => {
		it('should display the guardian checkbox in the new member form', () => {
			// Navigate to new member form
			cy.visit('/members/new')
			// Check that the guardian checkbox is visible
			cy.get('input[name="guardian"]').should('be.visible')
			// Check the label text in Serbian
			cy.get('label').contains('Ima staratelja?').should('be.visible')
		})

		it('should show guardian fields when checkbox is checked in new member form', () => {
			cy.visit('/members/new')
			// Initially, guardian fields should not be visible
			cy.get('input[name="guardian_first_name"]').should('not.be.visible')
			// Check the checkbox
			cy.get('input[name="guardian"]').check()

			// biome-ignore lint/suspicious/noExplicitAny: Force Alpine update
			cy.window().then((win: any) => win.Alpine.nextTick())
			// Now, guardian fields should be visible
			cy.get('input[name="guardian_first_name"]').should('be.visible')
			cy.get('input[name="guardian_last_name"]').should('be.visible')
			cy.get('input[name="guardian_gov_id"]').should('be.visible')
		})

		it('should hide guardian fields when checkbox is unchecked in new member form', () => {
			cy.visit('/members/new')
			// Check and then uncheck the checkbox
			cy.get('input[name="guardian"]').check()

			// biome-ignore lint/suspicious/noExplicitAny: Force Alpine update
			cy.window().then((win: any) => win.Alpine.nextTick())
			cy.get('input[name="guardian_first_name"]').should('be.visible')
			cy.get('input[name="guardian"]').uncheck()

			// biome-ignore lint/suspicious/noExplicitAny: Force Alpine update
			cy.window().then((win: any) => win.Alpine.nextTick())
			// Fields should disappear
			cy.get('input[name="guardian_first_name"]').should('not.be.visible')
		})

		it.skip('should display members on the members page', () => {
			// Navigate to members page
			cy.visit('/members')
			cy.get('h2').should('contain', 'Članovi')
			cy.get('tbody tr').then(($rows) => {
				if ($rows.length > 0) {
					cy.log(`Found ${$rows.length} members`)
					cy.get('a[href*="/edit"]').should('have.length.greaterThan', 0)
				} else {
					cy.log('No members found in the list')
				}
			})
		})

		it.skip('should display guardian checkbox in edit member form', () => {
			// Navigate to members list and click edit for the first member
			cy.visit('/members')
			cy.get('a[href*="/edit"]').first().click()
			cy.wait(100)
			cy.get('input[name="guardian"]').should('be.visible')
		})

		it.skip('should display guardian checkbox in edit member form', () => {
			// Navigate to members list and click edit for the first member
			cy.visit('/members')
			cy.get('a[href*="/edit"]').first().click()
			cy.wait(100)
			cy.get('input[name="guardian"]').should('be.visible')
		})
	})

	describe('Register Page Guardian', () => {
		it('should display the guardian checkbox on the register page', () => {
			cy.visit('/register')
			cy.get('input[name="guardian"]').should('be.visible')
			// Check the label text in Serbian
			cy.get('label').contains('Da li je staratelj?').should('be.visible')
		})

		it('should show guardian fields when checkbox is checked on register page', () => {
			cy.visit('/register')
			// Initially, fields should not be visible
			cy.get('input[name="guardian_first_name"]').should('not.be.visible')
			// Check the checkbox
			cy.get('input[name="guardian"]').check()

			// biome-ignore lint/suspicious/noExplicitAny: Force Alpine update
			cy.window().then((win: any) => win.Alpine.nextTick())
			// Fields should appear
			cy.get('input[name="guardian_first_name"]').should('be.visible')
			cy.get('input[name="guardian_last_name"]').should('be.visible')
			cy.get('input[name="guardian_gov_id"]').should('be.visible')
		})

		it('should hide guardian fields when checkbox is unchecked on register page', () => {
			cy.visit('/register')
			cy.get('input[name="guardian"]').check()
			// biome-ignore lint/suspicious/noExplicitAny: Force Alpine update
			cy.window().then((win: any) => win.Alpine.nextTick())
			cy.get('input[name="guardian_first_name"]').should('be.visible')
			cy.get('input[name="guardian"]').uncheck()
			// biome-ignore lint/suspicious/noExplicitAny: Force Alpine update
			cy.window().then((win: any) => win.Alpine.nextTick())
			cy.get('input[name="guardian_first_name"]').should('not.be.visible')
		})
	})
})
