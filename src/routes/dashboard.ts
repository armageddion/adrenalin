import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { customLocaleDetector } from '../middleware/i18n'
import * as q from '../queries'
import { MemberList, MembersSection, renderMemberRows } from '../views/components/members'
import { renderVisitRows, VisitList, VisitsSection } from '../views/components/visits'
import { PageLayout } from '../views/layouts'

const dashboardRouter = new Hono()

dashboardRouter.get('', async (c) => {
	const t = await useTranslation(c)
	const locale = customLocaleDetector(c)
	const cookieHeader = c.req.raw.headers.get('cookie')
	let user = null
	if (cookieHeader) {
		const cookies = cookieHeader.split(';').reduce(
			(acc, cookie) => {
				const [name, value] = cookie.trim().split('=')
				acc[name] = decodeURIComponent(value)
				return acc
			},
			{} as Record<string, string>,
		)
		if (cookies.user) {
			try {
				user = JSON.parse(cookies.user)
			} catch {}
		}
	}

	// Parse params for members
	const memberPage = Number.parseInt(c.req.query('member_page') || '1', 10)
	const memberLimit = Number.parseInt(c.req.query('member_limit') || '100', 10)
	const memberSearch = c.req.query('member_search') || ''
	const append = c.req.query('append') === '1'

	// Parse params for visits
	const visitPage = Number.parseInt(c.req.query('visit_page') || '1', 10)
	const visitLimit = Number.parseInt(c.req.query('visit_limit') || '100', 10)
	const visitSearch = c.req.query('visit_search') || ''

	// Fetch members data
	const members = memberSearch
		? await q.searchMembersPaginated(memberSearch, memberPage, memberLimit)
		: await q.getMembersPaginated(memberPage, memberLimit)
	const totalMembers = memberSearch ? await q.searchMembersCount(memberSearch) : await q.getMembersCount()

	const memberPagination = {
		currentPage: memberPage,
		totalPages: Math.ceil(totalMembers / memberLimit),
		limit: memberLimit,
		totalItems: totalMembers,
		hasNext: memberPage < Math.ceil(totalMembers / memberLimit),
		hasPrev: memberPage > 1,
	}

	// Fetch visits data
	const visits = visitSearch
		? await q.searchVisitsPaginated(visitSearch, visitPage, visitLimit)
		: await q.getVisitsPaginated(visitPage, visitLimit)
	const totalVisits = visitSearch ? await q.searchVisitsCount(visitSearch) : await q.getVisitsCount()

	const visitPagination = {
		currentPage: visitPage,
		totalPages: Math.ceil(totalVisits / visitLimit),
		limit: visitLimit,
		totalItems: totalVisits,
		hasNext: visitPage < Math.ceil(totalVisits / visitLimit),
		hasPrev: visitPage > 1,
	}

	// Handle HTMX append
	if (append) {
		if (c.req.query('member_page')) {
			return c.html(html`${renderMemberRows(members, t)}`)
		} else if (c.req.query('visit_page')) {
			return c.html(html`${renderVisitRows(visits, t)}`)
		}
	}

	// Handle HTMX updates
	if (c.req.header('HX-Request')) {
		if (c.req.query('member_page') || c.req.query('member_search')) {
			const { content } = MemberList({
				members,
				t,
				pagination: memberPagination,
				search: memberSearch,
				paramPrefix: 'member_',
			})
			return c.html(String(content))
		} else if (c.req.query('visit_page') || c.req.query('visit_search')) {
			const { content } = VisitList({ visits, t, pagination: visitPagination, paramPrefix: 'visit_' })
			return c.html(String(content))
		}
	}

	const content = html`
		<div class="p-6">
			<div class="flex gap-6">
				${MembersSection({ members, t, pagination: memberPagination, search: memberSearch, paramPrefix: 'member_' })}
				${VisitsSection({ visits, t, pagination: visitPagination, search: visitSearch, paramPrefix: 'visit_' })}
			</div>
		</div>
	`
	return c.html(PageLayout({ title: t('components.dashboard.title'), content, locale, t, user }))
})

export default dashboardRouter
