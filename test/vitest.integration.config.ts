import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		include: ['test/integration/**/*.test.ts', 'test/integration/**/*.spec.ts'],
		exclude: ['test/e2e/**', 'test/unit/**'],
	},
})
