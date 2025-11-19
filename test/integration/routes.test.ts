import { describe, expect, it, vi } from 'vitest'
import app from '../../src/routes'

// Mock the queries module with factory
vi.mock('../../src/queries', () => {
	const mockQueries = {
		getNewMembersLast30Days: vi.fn(() => Promise.resolve(5)),
		getVisitsToday: vi.fn(() => Promise.resolve(3)),
		getVisitsLast7Days: vi.fn(() => Promise.resolve(10)),
		getVisitsPrevious7Days: vi.fn(() => Promise.resolve(8)),
		getVisitsLast30Days: vi.fn(() => Promise.resolve(25)),
		getVisitsPrevious30Days: vi.fn(() => Promise.resolve(20)),
		searchMembers: vi.fn(() => Promise.resolve([])),
		getMembers: vi.fn(() => Promise.resolve([])),
		getMembersPaginated: vi.fn(() => Promise.resolve([])),
		getMembersCount: vi.fn(() => Promise.resolve(0)),
		getPackages: vi.fn(() => Promise.resolve([])),
		getMember: vi.fn(() => Promise.resolve(undefined)),
		getVisits: vi.fn(() => Promise.resolve([])),
		getVisitsPaginated: vi.fn(() => Promise.resolve([])),
		getVisitsCount: vi.fn(() => Promise.resolve(0)),
		getVisitsByMemberId: vi.fn(() => Promise.resolve([])),
		addMember: vi.fn(() => Promise.resolve(1)),
		updateMember: vi.fn(() => Promise.resolve()),
		deleteMember: vi.fn(() => Promise.resolve()),
		addPackage: vi.fn(() => Promise.resolve(1)),
		updatePackage: vi.fn(() => Promise.resolve()),
		deletePackage: vi.fn(() => Promise.resolve()),
		addVisit: vi.fn(() => Promise.resolve()),
		deleteVisit: vi.fn(() => Promise.resolve()),
		getMembersWithUpcomingExpiries: vi.fn(() => Promise.resolve([])),
		logMessage: vi.fn(() => Promise.resolve()),
		searchMembersCount: vi.fn(() => Promise.resolve(0)),
		searchMembersPaginated: vi.fn(() => Promise.resolve([])),
	}
	return mockQueries
})

import * as q from '../../src/queries'

describe('Hono App Routes', () => {
	it('should return 200 for GET /', async () => {
		const response = await app.request('/')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Kontrolna tabla') // Dashboard in Serbian
	})

	it('should return 200 for GET /members', async () => {
		const response = await app.request('/members')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('members') // Assuming members list
	})

	it('should handle search query', async () => {
		vi.mocked(q.searchMembers).mockResolvedValue([
			{
				id: 1,
				first_name: 'Anja',
				last_name: 'Doe',
				card_id: 'CARD123',
				created_at: '2023-01-01',
				updated_at: '2023-01-01',
				guardian: 0,
				notify: 1,
				year_of_birth: 1990,
			},
		])
		const response = await app.request('/search?q=anja')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Anja') // Assuming search results
	})

	it('should return 200 for GET /packages', async () => {
		const response = await app.request('/packages')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('packages') // Assuming packages list
	})

	it('should return 200 for GET /visits', async () => {
		const response = await app.request('/visits')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('visits') // Assuming visits list
	})

	it('should return 200 for GET /settings', async () => {
		const response = await app.request('/settings')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('settings') // Assuming settings page
	})

	it('should return 404 for non-existent route', async () => {
		const response = await app.request('/non-existent')
		expect(response.status).toBe(404)
	})

	it('should handle POST /members', async () => {
		const body = new FormData()
		body.append('first_name', 'John')
		body.append('last_name', 'Doe')
		body.append('card_id', 'CARD123')
		body.append('year_of_birth', '1990')

		const response = await app.request('/members', {
			method: 'POST',
			body,
		})

		expect(response.status).toBe(200)
		expect(q.addMember).toHaveBeenCalledWith(
			expect.objectContaining({
				first_name: 'John',
				last_name: 'Doe',
				card_id: 'CARD123',
				year_of_birth: 1990,
			}),
		)
		expect(await response.text()).toContain('member-list') // Assuming MemberList content
	})

	it('should handle POST /packages', async () => {
		const body = new FormData()
		body.append('name', 'Test Package')
		body.append('price', '50.00')
		body.append('description', 'A test package')

		const response = await app.request('/packages', {
			method: 'POST',
			body,
		})

		expect(response.status).toBe(200)
		expect(q.addPackage).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'Test Package',
				price: 50.0,
				description: 'A test package',
			}),
		)
		expect(response.headers.get('HX-Redirect')).toBe('/packages')
	})

	it('should handle DELETE /members/:id', async () => {
		const response = await app.request('/members/1', {
			method: 'DELETE',
		})

		expect(response.status).toBe(200)
		expect(q.deleteMember).toHaveBeenCalledWith(1)
		expect(await response.text()).toContain('member-list')
	})

	it('should handle GET /members/:id', async () => {
		vi.mocked(q.getMember).mockResolvedValue({
			id: 1,
			first_name: 'John',
			last_name: 'Doe',
			card_id: 'CARD123',
			created_at: '2023-01-01',
			updated_at: '2023-01-01',
			guardian: 0,
			notify: 1,
			year_of_birth: 1990,
		})

		const response = await app.request('/members/1')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('John Doe')
	})

	it('should handle POST /register', async () => {
		const body = new FormData()
		body.append('first_name', 'Jane')
		body.append('last_name', 'Smith')
		body.append('card_id', 'CARD456')
		body.append('year_of_birth', '1985')

		const response = await app.request('/register', {
			method: 'POST',
			body,
		})

		expect(response.status).toBe(200)
		expect(q.addMember).toHaveBeenCalled()
		expect(response.headers.get('HX-Redirect')).toBe('/members')
	})

	it('should handle POST /cron with valid secret', async () => {
		process.env.CRON_SECRET = 'test-secret'
		vi.mocked(q.getMembersWithUpcomingExpiries).mockResolvedValue([
			{
				id: 1,
				email: 'test@example.com',
				first_name: 'John',
				last_name: 'Doe',
				card_id: 'CARD123',
				created_at: '2023-01-01',
				updated_at: '2023-01-01',
				year_of_birth: 1990,
				expires_at: '2023-12-31',
				guardian: 0,
				notify: 1,
			},
		])

		const response = await app.request('/cron', {
			method: 'POST',
			headers: { 'X-Secret-Key': 'test-secret' },
		})

		expect(response.status).toBe(200)
		expect(await response.text()).toBe('Cron job completed')
	})

	it('should handle POST /cron with invalid secret', async () => {
		const response = await app.request('/cron', {
			method: 'POST',
			headers: { 'X-Secret-Key': 'wrong-secret' },
		})

		expect(response.status).toBe(401)
		expect(await response.text()).toBe('Unauthorized')
	})
})
