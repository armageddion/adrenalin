import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as q from '../../src/queries'
import { parseMemberData } from '../../src/routes/members'
import { parsePackageData } from '../../src/routes/packages'
import { sendEmail } from '../../src/routes/utils'
import { logVisit } from '../../src/routes/visits'

describe('parseMemberData', () => {
	it('should parse valid member data correctly', () => {
		const body = {
			first_name: 'John',
			last_name: 'Doe',
			email: 'john@example.com',
			phone: '123456789',
			card_id: 'CARD123',
			gov_id: 'GOV123',
			package_id: '1',
			expires_at: '2025-12-31',
			image: 'image.jpg',
			notes: 'Test notes',
			address_street: 'Main St',
			address_number: '123',
			address_city: 'Test City',
			guardian: 'on',
			guardian_first_name: 'Jane',
			guardian_last_name: 'Doe',
			guardian_gov_id: 'GOV456',
			notify: 'on',
			year_of_birth: '1990',
		}

		const result = parseMemberData(body)

		expect(result).toEqual({
			first_name: 'John',
			last_name: 'Doe',
			email: 'john@example.com',
			phone: '123456789',
			card_id: 'CARD123',
			gov_id: 'GOV123',
			package_id: 1,
			expires_at: '2025-12-31',
			image: 'image.jpg',
			notes: 'Test notes',
			address_street: 'Main St',
			address_number: '123',
			address_city: 'Test City',
			guardian: 1,
			guardian_first_name: 'Jane',
			guardian_last_name: 'Doe',
			guardian_gov_id: 'GOV456',
			notify: 1,
			year_of_birth: 1990,
		})
	})

	it('should handle missing optional fields', () => {
		const body = {
			first_name: 'Jane',
			last_name: 'Smith',
			card_id: 'CARD456',
			year_of_birth: '1985',
		}

		const result = parseMemberData(body)

		expect(result).toEqual({
			first_name: 'Jane',
			last_name: 'Smith',
			email: undefined,
			phone: undefined,
			card_id: 'CARD456',
			gov_id: undefined,
			package_id: undefined,
			expires_at: undefined,
			image: undefined,
			notes: undefined,
			address_street: undefined,
			address_number: undefined,
			address_city: undefined,
			guardian: 0,
			guardian_first_name: undefined,
			guardian_last_name: undefined,
			guardian_gov_id: undefined,
			notify: 1,
			year_of_birth: 1985,
		})
	})

	it('should handle notify off', () => {
		const body = {
			first_name: 'Bob',
			last_name: 'Brown',
			card_id: 'CARD789',
			year_of_birth: '2000',
			notify: 'off',
		}

		const result = parseMemberData(body)

		expect(result.notify).toBe(0)
	})

	it('should handle guardian off', () => {
		const body = {
			first_name: 'Alice',
			last_name: 'Johnson',
			card_id: 'CARD101',
			year_of_birth: '1995',
		}

		const result = parseMemberData(body)

		expect(result.guardian).toBe(0)
	})
})

describe('parsePackageData', () => {
	it('should parse valid package data correctly', () => {
		const body = {
			name: 'Basic Package',
			price: '29.99',
			description: 'A basic package',
			display_order: '1',
		}

		const result = parsePackageData(body)

		expect(result).toEqual({
			name: 'Basic Package',
			price: 29.99,
			description: 'A basic package',
			display_order: 1,
		})
	})

	it('should handle missing optional fields', () => {
		const body = {
			name: 'Premium Package',
		}

		const result = parsePackageData(body)

		expect(result).toEqual({
			name: 'Premium Package',
			price: undefined,
			description: undefined,
			display_order: undefined,
		})
	})

	it('should handle invalid price', () => {
		const body = {
			name: 'Invalid Package',
			price: 'not-a-number',
		}

		const result = parsePackageData(body)

		expect(result.price).toBeNaN()
	})
})

describe('logVisit', () => {
	beforeEach(() => {
		vi.mock('../../src/queries', () => ({
			addVisit: vi.fn(),
			getVisitsByMemberId: vi.fn(() => []),
		}))
	})

	it('should log visit and return VisitList JSX', async () => {
		const mockT = vi.fn((key) => key)
		const memberId = 1

		const result = await logVisit(memberId, mockT)

		expect(q.addVisit).toHaveBeenCalledWith(memberId, undefined)
		expect(q.getVisitsByMemberId).toHaveBeenCalledWith(memberId)
		// Just check that it returns something
		expect(result).toBeDefined()
	})
})

describe('sendEmail', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn())
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should send email successfully', async () => {
		const mockFetch = vi.mocked(fetch)
		mockFetch.mockResolvedValue({ ok: true } as Response)

		const result = await sendEmail('test@example.com', 'Test Subject', 'Test Message')

		expect(mockFetch).toHaveBeenCalledWith('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from: 'noreply@yourapp.com',
				to: ['test@example.com'],
				subject: 'Test Subject',
				html: 'Test Message',
			}),
		})
		expect(result).toBe(true)
	})

	it('should handle email failure', async () => {
		const mockFetch = vi.mocked(fetch)
		mockFetch.mockResolvedValue({ ok: false } as Response)

		const result = await sendEmail('test@example.com', 'Test Subject', 'Test Message')

		expect(result).toBe(false)
	})

	it('should handle network error', async () => {
		const mockFetch = vi.mocked(fetch)
		mockFetch.mockRejectedValue(new Error('Network error'))

		const result = await sendEmail('test@example.com', 'Test Subject', 'Test Message')

		expect(result).toBe(false)
	})
})
