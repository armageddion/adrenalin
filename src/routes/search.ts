import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import * as q from '../queries'
import { SearchResults } from '../views/nav'
import { logVisit } from './visits'

const searchRouter = new Hono()

searchRouter.get('/search', (c) => {
	const t = useTranslation(c)
	const query = c.req.query('q') || ''
	const members = q.searchMembers(query)
	return c.html(SearchResults({ members, t }))
})

searchRouter.get('/members-search', (c) => {
	const t = useTranslation(c)
	const query = c.req.query('q') || ''
	if (!query) {
		return c.html('<div id="search-results"></div>') // Empty when no query
	}
	const members = q.searchMembers(query)

	// Multiple results - show search dropdown
	const results = SearchResults({ members, t })
	return c.html(`
		<div id="search-results" class="absolute top-full left-0 right-0 bg-background border rounded shadow-lg max-h-96 overflow-y-auto">
			${results}
		</div>
	`)
})

searchRouter.get('/visit-input', (c) => {
	const t = useTranslation(c)
	const query = c.req.query('q') || ''
	if (!query) {
		return c.html('<div id="search-results"></div>') // Empty when no query
	}
	const members = q.searchMembers(query)

	// If exactly one result, automatically log a visit and redirect to member profile
	if (members.length === 1) {
		const member = members[0]
		logVisit(member.id, t)
		c.header('HX-Redirect', `/members/${member.id}`)
		return c.text('', 200)
	}

	// If no results, redirect to new member form
	if (members.length === 0) {
		c.header('HX-Redirect', '/members/new')
		return c.text('', 200)
	}

	// Multiple results - show search dropdown
	const results = SearchResults({ members, t })
	return c.html(`
		<div id="search-results" class="absolute top-full left-0 right-0 bg-background border rounded shadow-lg max-h-96 overflow-y-auto">
			${results}
		</div>
	`)
})

export default searchRouter
