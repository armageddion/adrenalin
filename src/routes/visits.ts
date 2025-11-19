import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { customLocaleDetector, type TFn } from '../middleware/i18n'
import * as q from '../queries'
import type { Member, Visit } from '../types'
import { VisitList } from '../views/components'
import { renderLoadMoreSentinel, renderVisitRows } from '../views/components/visits'
import { PageLayout } from '../views/layouts'
import { notFoundResponse } from './utils'

export function logVisit(memberId: number, t: TFn) {
	q.addVisit(memberId)
	const visits = q.getVisitsByMemberId(memberId)
	return VisitList({ visits, t })
}

const visitsRouter = new Hono()

visitsRouter.get('/', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)

	const page = Number.parseInt(c.req.query('page') || '1', 10)
	const limit = Number.parseInt(c.req.query('limit') || '100', 10)
	const append = c.req.query('append') === '1'

	const visits = q.getVisitsPaginated(page, limit)
	const totalVisits = q.getVisitsCount()
	const totalPages = Math.ceil(totalVisits / limit)

	const pagination = {
		currentPage: page,
		totalPages,
		limit,
		totalItems: totalVisits,
		hasNext: page < totalPages,
		hasPrev: page > 1,
	}

	// If append mode, return only the table rows and next sentinel
	if (append) {
		return c.html(html`${renderVisitRows(visits, t)}${pagination.hasNext ? renderLoadMoreSentinel(pagination) : ''}`)
	}

	if (c.req.header('HX-Request')) {
		return c.html(VisitList({ visits, t, pagination }))
	}
	return c.html(
		PageLayout({
			title: t('components.visits.title'),
			content: VisitList({ visits, t, pagination }),
			locale,
			t,
		}),
	)
})

visitsRouter.post('/', async (c) => {
	const t = useTranslation(c)
	const body = await c.req.parseBody()
	const cardId = body.card_id as string
	const member = q.searchMembers(cardId)[0]
	if (member) {
		return c.html(logVisit(member.id, t))
	}
	return notFoundResponse(c, t, 'member')
})

visitsRouter.delete('/:id', (c) => {
	const t = useTranslation(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	q.deleteVisit(id)
	const referer = c.req.header('Referer') || ''
	const memberMatch = referer.match(/\/members\/(\d+)/)
	let visits: Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
	if (memberMatch) {
		const memberId = Number.parseInt(memberMatch[1], 10)
		visits = q.getVisitsByMemberId(memberId)
	} else {
		visits = q.getVisits()
	}

	return c.html(VisitList({ visits, t }))
})

export default visitsRouter
