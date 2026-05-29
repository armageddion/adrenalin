import { describe, expect, it } from 'vitest'
import { formatDate } from '../../src/utils'

describe('formatDate', () => {
	it('formats ISO date-only strings to dd-mm-yyyy', () => {
		expect(formatDate('2025-12-31')).toBe('31-12-2025')
	})

	it('formats ISO datetime strings to dd-mm-yyyy', () => {
		expect(formatDate('2025-12-31T09:30:00Z')).toBe('31-12-2025')
	})

	it('formats Date objects to dd-mm-yyyy', () => {
		expect(formatDate(new Date('2025-12-31'))).toBe('31-12-2025')
	})

	it('returns N/A for invalid or empty values', () => {
		expect(formatDate(undefined)).toBe('N/A')
		expect(formatDate(null)).toBe('N/A')
		expect(formatDate('invalid-date')).toBe('N/A')
	})
})
