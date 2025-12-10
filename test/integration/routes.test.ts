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
		getUsers: vi.fn(() => Promise.resolve([])),
		createUser: vi.fn(() => Promise.resolve()),
		updateUser: vi.fn(() => Promise.resolve()),
		deleteUser: vi.fn(() => Promise.resolve()),
		usernameExists: vi.fn(() => Promise.resolve(false)),
		getMembersWithSignatures: vi.fn(() => Promise.resolve([])),
		cardIdExists: vi.fn(() => Promise.resolve(false)),
		govIdExists: vi.fn(() => Promise.resolve(false)),
	}
	return mockQueries
})

// Mock auth middleware
vi.mock('../../src/middleware/auth', () => ({
	verifyPassword: vi.fn(() => Promise.resolve(true)),
	getUserByUsername: vi.fn(() => Promise.resolve({ id: 1, username: 'admin', password_hash: 'hash', role: 'admin' })),
	hashPassword: vi.fn(() => Promise.resolve('hashed')),
}))

// Mock child_process
vi.mock('node:child_process', () => ({
	promisify: vi.fn(() => vi.fn(() => Promise.resolve({ stdout: '', stderr: '' }))),
}))

import * as q from '../../src/queries'

describe('Hono App Routes', () => {
	beforeEach(() => {
		// Set a dummy user cookie to bypass auth middleware
		const _userCookie = `user=${encodeURIComponent(JSON.stringify({ id: 1, username: 'test', role: 'admin' }))}; Path=/`
		// Since Hono request doesn't have cookies easily, we need to mock or set headers
		// Actually, for Hono, we can pass headers in request
		// But to make it global, perhaps modify the app
	})

	// Helper to create request with user cookie
	const _requestWithUser = (url: string, options: RequestInit = {}) => {
		return app.request(url, {
			...options,
			headers: {
				...options.headers,
				Cookie: `user=${encodeURIComponent(JSON.stringify({ id: 1, username: 'test', role: 'admin' }))}`,
			},
		})
	}
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
		expect(response.headers.get('HX-Redirect')).toBe('/')
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
		expect(response.headers.get('HX-Redirect')).toBe('/register')
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

	it('should return 200 for GET /login', async () => {
		const response = await app.request('/login')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Prijavi se')
	})

	it('should handle POST /login with valid credentials', async () => {
		const body = new FormData()
		body.append('username', 'admin')
		body.append('password', 'password')

		const response = await app.request('/login', {
			method: 'POST',
			body,
		})

		expect(response.status).toBe(200)
		expect(response.headers.get('HX-Redirect')).toBe('/')
	})

	it('should handle POST /login with invalid credentials', async () => {
		const { verifyPassword } = await import('../../src/middleware/auth')
		vi.mocked(verifyPassword).mockResolvedValue(false)

		const body = new FormData()
		body.append('username', 'admin')
		body.append('password', 'wrong')

		const response = await app.request('/login', {
			method: 'POST',
			body,
		})

		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Invalid credentials')
	})

	it('should handle POST /logout', async () => {
		const response = await app.request('/logout', {
			method: 'POST',
		})

		expect(response.status).toBe(302)
		expect(response.headers.get('Set-Cookie')).toContain('user=;')
	})

	it('should return 200 for GET /manifest.json', async () => {
		const response = await app.request('/manifest.json')
		expect(response.status).toBe(200)
		const json = await response.json()
		expect(json.name).toBe('Adrenalin')
	})

	it('should return 200 for GET /register', async () => {
		const response = await app.request('/register')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Register')
	})

	it('should return 200 for GET /setup', async () => {
		const response = await app.request('/setup')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Adrenalin CRM Setup')
	})

	it('should handle POST /setup with file', async () => {
		const body = new FormData()
		body.append('dbfile', new Blob(['test']), 'test.db')

		const response = await app.request('/setup', {
			method: 'POST',
			body,
		})

		expect(response.status).toBe(302)
		expect(response.headers.get('Location')).toBe('/')
	})

	it('should return 200 for GET /users', async () => {
		const response = await app.request('/users', {
			headers: { Cookie: `user=${encodeURIComponent(JSON.stringify({ id: 1, username: 'admin', role: 'admin' }))}` },
		})
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Users')
	})

	it('should return 403 for GET /users without admin', async () => {
		const response = await app.request('/users')
		expect(response.status).toBe(403)
	})

	it('should return 200 for GET /users/new', async () => {
		const response = await app.request('/users/new', {
			headers: { Cookie: `user=${encodeURIComponent(JSON.stringify({ id: 1, username: 'admin', role: 'admin' }))}` },
		})
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Add User')
	})

	it('should handle POST /users', async () => {
		const body = new FormData()
		body.append('username', 'testuser')
		body.append('password', 'password')
		body.append('role', 'user')

		const response = await app.request('/users', {
			method: 'POST',
			body,
			headers: { Cookie: `user=${encodeURIComponent(JSON.stringify({ id: 1, username: 'admin', role: 'admin' }))}` },
		})

		expect(response.status).toBe(200)
		expect(q.createUser).toHaveBeenCalled()
		expect(response.headers.get('HX-Redirect')).toBe('/users')
	})

	it('should return 200 for GET /users/1/edit', async () => {
		vi.mocked(q.getUsers).mockResolvedValue([
			{
				id: 1,
				username: 'test',
				password_hash: 'hash',
				role: 'user',
				created_at: '2023-01-01',
				updated_at: '2023-01-01',
			},
		])

		const response = await app.request('/users/1/edit', {
			headers: { Cookie: `user=${encodeURIComponent(JSON.stringify({ id: 1, username: 'admin', role: 'admin' }))}` },
		})
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Edit User')
	})

	it('should handle PUT /users/1', async () => {
		const body = new FormData()
		body.append('username', 'updated')
		body.append('role', 'admin')

		const response = await app.request('/users/1', {
			method: 'PUT',
			body,
			headers: { Cookie: `user=${encodeURIComponent(JSON.stringify({ id: 1, username: 'admin', role: 'admin' }))}` },
		})

		expect(response.status).toBe(200)
		expect(q.updateUser).toHaveBeenCalled()
		expect(response.headers.get('HX-Redirect')).toBe('/users')
	})

	it('should handle DELETE /users/1', async () => {
		const response = await app.request('/users/1', {
			method: 'DELETE',
			headers: { Cookie: `user=${encodeURIComponent(JSON.stringify({ id: 1, username: 'admin', role: 'admin' }))}` },
		})

		expect(response.status).toBe(200)
		expect(q.deleteUser).toHaveBeenCalledWith(1)
	})

	it('should return 200 for GET /members/new', async () => {
		const response = await app.request('/members/new')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Dodaj člana')
	})

	it('should return 200 for GET /members/1/edit', async () => {
		vi.mocked(q.getMember).mockResolvedValue({
			id: 1,
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
			guardian: 0,
			guardian_first_name: undefined,
			guardian_last_name: undefined,
			guardian_gov_id: undefined,
			notify: 1,
			year_of_birth: 1990,
			created_at: '2023-01-01',
			updated_at: '2023-01-01',
			signature: undefined,
		})

		const response = await app.request('/members/1/edit')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Izmeni člana')
	})

	it('should return 200 for GET /members/1/consent', async () => {
		vi.mocked(q.getMember).mockResolvedValue({
			id: 1,
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
			guardian: 0,
			guardian_first_name: undefined,
			guardian_last_name: undefined,
			guardian_gov_id: undefined,
			notify: 1,
			year_of_birth: 1990,
			created_at: '2023-01-01',
			updated_at: '2023-01-01',
			signature: 'data:image/png;base64,test',
		})

		const response = await app.request('/members/1/consent')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Izjava odgovornosti')
	})

	it('should handle POST /members/1', async () => {
		const body = new FormData()
		body.append('first_name', 'Updated')
		body.append('last_name', 'Name')
		body.append('card_id', 'CARD123')
		body.append('year_of_birth', '1990')

		const response = await app.request('/members/1', {
			method: 'POST',
			body,
		})

		expect(response.status).toBe(200)
		expect(q.updateMember).toHaveBeenCalled()
		expect(response.headers.get('HX-Redirect')).toBe('/members')
	})

	it('should return 200 for GET /packages/new', async () => {
		const response = await app.request('/packages/new')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Dodaj paket')
	})

	it('should return 200 for GET /packages/1/edit', async () => {
		vi.mocked(q.getPackages).mockResolvedValue([
			{
				id: 1,
				name: 'Test Package',
				price: 50,
				description: 'Test',
				display_order: 1,
				created_at: '2023-01-01',
			},
		])

		const response = await app.request('/packages/1/edit')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('Izmeni paket')
	})

	it('should handle POST /packages/1', async () => {
		const body = new FormData()
		body.append('name', 'Updated Package')
		body.append('price', '60.00')
		body.append('description', 'Updated')

		const response = await app.request('/packages/1', {
			method: 'POST',
			body,
		})

		expect(response.status).toBe(200)
		expect(q.updatePackage).toHaveBeenCalled()
		expect(response.headers.get('HX-Redirect')).toBe('/packages')
	})

	it('should handle DELETE /packages/1', async () => {
		const response = await app.request('/packages/1', {
			method: 'DELETE',
		})

		expect(response.status).toBe(200)
		expect(q.deletePackage).toHaveBeenCalledWith(1)
	})

	it('should handle POST /visits', async () => {
		vi.mocked(q.searchMembers).mockResolvedValue([
			{
				id: 1,
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
				guardian: 0,
				guardian_first_name: undefined,
				guardian_last_name: undefined,
				guardian_gov_id: undefined,
				notify: 1,
				year_of_birth: 1990,
				created_at: '2023-01-01',
				updated_at: '2023-01-01',
				signature: undefined,
			},
		])

		const body = new FormData()
		body.append('card_id', 'CARD123')

		const response = await app.request('/visits', {
			method: 'POST',
			body,
		})

		expect(response.status).toBe(200)
		expect(q.addVisit).toHaveBeenCalledWith(1)
	})

	it('should handle DELETE /visits/1', async () => {
		const response = await app.request('/visits/1', {
			method: 'DELETE',
		})

		expect(response.status).toBe(200)
		expect(q.deleteVisit).toHaveBeenCalledWith(1)
	})

	it('should handle GET /members-search', async () => {
		vi.mocked(q.searchMembers).mockResolvedValue([
			{
				id: 1,
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
				guardian: 0,
				guardian_first_name: undefined,
				guardian_last_name: undefined,
				guardian_gov_id: undefined,
				notify: 1,
				year_of_birth: 1990,
				created_at: '2023-01-01',
				updated_at: '2023-01-01',
				signature: undefined,
			},
		])

		const response = await app.request('/members-search?q=john')
		expect(response.status).toBe(200)
		expect(await response.text()).toContain('John')
	})

	it('should handle GET /visit-input with single result', async () => {
		vi.mocked(q.searchMembers).mockResolvedValue([
			{
				id: 1,
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
				guardian: 0,
				guardian_first_name: undefined,
				guardian_last_name: undefined,
				guardian_gov_id: undefined,
				notify: 1,
				year_of_birth: 1990,
				created_at: '2023-01-01',
				updated_at: '2023-01-01',
				signature: undefined,
			},
		])

		const response = await app.request('/visit-input?q=CARD123')
		expect(response.status).toBe(200)
		expect(response.headers.get('HX-Redirect')).toBe('/members/1')
		expect(q.addVisit).toHaveBeenCalledWith(1)
	})

	it('should handle POST /settings/print-consents', async () => {
		vi.mocked(q.getMembersWithSignatures).mockResolvedValue([
			{
				id: 1,
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
				guardian: 0,
				guardian_first_name: undefined,
				guardian_last_name: undefined,
				guardian_gov_id: undefined,
				notify: 1,
				year_of_birth: 1990,
				created_at: '2023-01-01',
				updated_at: '2023-01-01',
				signature: 'data:image/png;base64,test',
			},
		])

		const response = await app.request('/settings/print-consents', {
			method: 'POST',
		})

		// Since exec is not available in test, it returns 500
		expect(response.status).toBe(500)
	})
})
