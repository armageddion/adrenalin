import { JSDOM } from 'jsdom'
import { describe, expect, it, vi } from 'vitest'
import type { Member } from '../../src/types'
import { MainPanel, MemberList, VisitList } from '../../src/views/components'
import { SearchResults } from '../../src/views/nav'

// Mock Alpine.js
vi.stubGlobal('Alpine', {
	data: vi.fn(() => ({})),
})

describe('MemberList', () => {
	it('should render member list with members', () => {
		const members = [
			{
				id: 1,
				first_name: 'John',
				last_name: 'Doe',
				email: 'john@example.com',
				card_id: 'CARD123',
				created_at: '2023-01-01',
				updated_at: '2023-01-01',
				guardian: 0,
				notify: 1,
				year_of_birth: 1990,
			},
		]
		const t = vi.fn((key) => key)

		const { content } = MemberList({ members, t })
		const htmlString = content.toString() as string
		const dom = new JSDOM(htmlString)
		const document = dom.window.document

		expect(document.querySelector('h2')?.textContent).toContain('components.members.title')
		expect(document.querySelector('table')).toBeTruthy()
		expect(document.querySelector('a')).toBeTruthy()
	})

	it('should render empty list', () => {
		const members: Member[] = []
		const t = vi.fn((key) => key)

		const { content } = MemberList({ members, t })
		const htmlString = content.toString() as string
		const dom = new JSDOM(htmlString)
		const document = dom.window.document

		expect(document.querySelector('h2')?.textContent).toContain('components.members.title')
		expect(document.querySelectorAll('tr').length).toBe(1) // Only header
	})
})

describe('VisitList', () => {
	it('should render visit list', () => {
		const visits = [
			{ id: 1, member_id: 1, first_name: 'John', last_name: 'Doe', created_at: '2023-01-01', notes: 'Test visit' },
		]
		const t = vi.fn((key) => key)

		const content = VisitList({ visits, t })
		const htmlString = String(content.content)
		const dom = new JSDOM(htmlString)
		const document = dom.window.document

		expect(document.querySelector('h2')?.textContent).toContain('components.visits.title')
		const tds = document.querySelectorAll('td')
		expect(tds[0]?.textContent).toContain('John Doe')
		expect(tds[1]?.textContent).toContain('1/1/2023')
	})
})

describe('MainPanel', () => {
	it('should render dashboard stats', () => {
		const stats = {
			newMembers30Days: 5,
			visitsToday: 3,
			visitsLast7Days: 10,
			visitsPrevious7Days: 8,
			visitsLast30Days: 25,
			visitsPrevious30Days: 20,
		}
		const t = vi.fn((key) => key)

		const content = MainPanel({ stats, t })
		const htmlString = content.toString()
		const dom = new JSDOM(htmlString)
		const document = dom.window.document

		expect(document.querySelector('h2')?.textContent).toContain('components.dashboard.title')
		const ps = document.querySelectorAll('p')
		expect(ps[1]?.textContent).toContain('3') // visitsToday
		expect(ps[3]?.textContent).toContain('5') // newMembers
	})
})

describe('SearchResults', () => {
	it('should render search results', () => {
		const members = [
			{
				id: 1,
				first_name: 'John',
				last_name: 'Doe',
				card_id: 'CARD123',
				created_at: '2023-01-01',
				updated_at: '2023-01-01',
				guardian: 0,
				notify: 1,
				year_of_birth: 1990,
			},
		]
		const t = vi.fn((key) => key)

		const content = SearchResults({ members, t })
		const htmlString = String(content)
		const dom = new JSDOM(htmlString)
		const document = dom.window.document

		expect(document.querySelector('a[href="/members/1"]')?.textContent).toContain('John Doe')
		expect(document.querySelector('.text-muted-foreground')?.textContent).toContain('CARD123')
	})
})
