import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3001',
		specPattern: 'test/e2e/**/*.cy.{js,jsx,ts,tsx}',
		supportFile: false,
	},
})
