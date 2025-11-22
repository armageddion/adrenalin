import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { customLocaleDetector } from '../middleware/i18n'
import * as q from '../queries'
import { MainPanel } from '../views/components'
import { PageLayout } from '../views/layouts'

const dashboardRouter = new Hono()

dashboardRouter.get('', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const newMembers30Days = await q.getNewMembersLast30Days()
	const visitsToday = await q.getVisitsToday()
	const visitsLast7Days = await q.getVisitsLast7Days()
	const visitsPrevious7Days = await q.getVisitsPrevious7Days()
	const visitsLast30Days = await q.getVisitsLast30Days()
	const visitsPrevious30Days = await q.getVisitsPrevious30Days()

	const stats = {
		newMembers30Days,
		visitsToday,
		visitsLast7Days,
		visitsPrevious7Days,
		visitsLast30Days,
		visitsPrevious30Days,
	}

	const content = html`
		<div class="h-screen overflow-auto">
			${MainPanel({ stats, t })}
		</div>
	`
	return c.html(PageLayout({ title: t('components.dashboard.title'), content, locale, t }))
})

export default dashboardRouter
