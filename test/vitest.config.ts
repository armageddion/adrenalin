import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['test/unit/**/*.test.ts', 'test/unit/**/*.spec.ts'],
		exclude: ['test/e2e/**', 'test/integration/**'],
	},
})
