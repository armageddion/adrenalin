import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { customLocaleDetector } from '../middleware/i18n'
import { getLocalIP } from '../utils'
import { Settings } from '../views/components'
import { PageLayout } from '../views/layouts'

const settingsRouter = new Hono()

settingsRouter.get('/settings', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const ip = getLocalIP()
	return c.html(
		PageLayout({
			title: t('settings.title') || 'Settings',
			content: Settings({ t, locale, ip }),
			locale,
			t,
		}),
	)
})

export default settingsRouter
