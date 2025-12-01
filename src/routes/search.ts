import { useTranslation } from '@intlify/hono'
import { type Context, Hono } from 'hono'
import * as q from '../queries'
import { SearchResults } from '../views/nav'
import { logVisit } from './visits'

const searchRouter = new Hono()

searchRouter.get('/search', async (c) => {
	const t = useTranslation(c)
	const query = c.req.query('q') || ''
	const members = await q.searchMembers(query)
	return c.html(SearchResults({ members, t }))
})

searchRouter.get('/members-search', async (c) => {
	const t = useTranslation(c)
	const query = c.req.query('q') || ''
	if (!query) {
		return c.html('<div id="search-results"></div>') // Empty when no query
	}
	const members = await q.searchMembers(query)

	// Multiple results - show search dropdown
	const results = SearchResults({ members, t })
	return renderSearchResults(c, results)
})

searchRouter.get('/visit-input', async (c) => {
	const t = useTranslation(c)
	const query = c.req.query('q') || ''
	if (!query) {
		return c.html('<div id="search-results"></div>') // Empty when no query
	}
	const members = await q.searchMembers(query)

	// If exactly one result, automatically log a visit and redirect to member profile
	if (members.length === 1) {
		const member = members[0]
		await logVisit(member.id, t)
		c.header('HX-Redirect', `/members/${member.id}`)
		return c.text('', 200)
	}

	// If no results, return error
	if (members.length === 0) {
		return c.text(t('nav.cardIdNotFound'), 404)
	}

	// Multiple results - show search dropdown
	const results = SearchResults({ members, t })
	return renderSearchResults(c, results)
})

function renderSearchResults(c: Context, results: ReturnType<typeof SearchResults>) {
	return c.html(`
		<div id="search-results" class="fixed top-12 left-0 right-0 bg-background/50 backdrop-blur-lg border rounded shadow-lg max-h-96 overflow-y-auto">
			${results}
		</div>
	`)
}

export default searchRouter
