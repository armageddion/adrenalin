import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { customLocaleDetector, type TFn } from '../middleware/i18n'
import * as q from '../queries'
import type { Member, Visit } from '../types'
import { VisitList } from '../views/components'
import { renderVisitRows } from '../views/components/visits'
import { PageLayout } from '../views/layouts'
import { notFoundResponse } from './utils'

export async function logVisit(memberId: number, t: TFn, _timestamp?: string) {
	await q.addVisit(memberId)
	const visits = await q.getVisitsByMemberId(memberId)
	const { content } = VisitList({ visits, t })
	return String(content)
}

const visitsRouter = new Hono()

visitsRouter.get('/', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)

	const page = Number.parseInt(c.req.query('page') || '1', 10)
	const limit = Number.parseInt(c.req.query('limit') || '100', 10)
	const append = c.req.query('append') === '1'

	const visits = await q.getVisitsPaginated(page, limit)
	const totalVisits = await q.getVisitsCount()
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
		return c.html(html`${renderVisitRows(visits, t)}`)
	}

	if (c.req.header('HX-Request')) {
		const { content } = VisitList({ visits, t, pagination })
		return c.html(String(content))
	}
	const { content } = VisitList({ visits, t, pagination })
	return c.html(
		PageLayout({
			title: t('components.visits.title'),
			content: String(content),
			locale,
			t,
		}),
	)
})

visitsRouter.post('/', async (c) => {
	const t = useTranslation(c)
	const body = await c.req.parseBody()
	const cardId = body.card_id as string
	const timestamp = body.timestamp as string | undefined
	const members = await q.searchMembers(cardId)
	const member = members[0]
	if (member) {
		return c.html(await logVisit(member.id, t, timestamp))
	}
	return notFoundResponse(c, t, 'member')
})

visitsRouter.delete('/:id', async (c) => {
	const t = useTranslation(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	await q.deleteVisit(id)
	const referer = c.req.header('Referer') || ''
	const memberMatch = referer.match(/\/members\/(\d+)/)
	let visits: Array<Visit & Pick<Member, 'first_name' | 'last_name'>>
	if (memberMatch) {
		const memberId = Number.parseInt(memberMatch[1], 10)
		visits = await q.getVisitsByMemberId(memberId)
	} else {
		visits = await q.getVisits()
	}

	const { content } = VisitList({ visits, t })
	return c.html(String(content))
})

export default visitsRouter
