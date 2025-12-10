import { exec } from 'node:child_process'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { customLocaleDetector } from '../middleware/i18n'
import * as q from '../queries'
import { getLocalIP } from '../utils'
import { Settings } from '../views/components'
import { PageLayout } from '../views/layouts'

const settingsRouter = new Hono()

settingsRouter.get('/settings', async (c) => {
	const t = await useTranslation(c)
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

settingsRouter.post('/settings/print-consents', async (c) => {
	if (process.env.NODE_ENV === 'test') {
		return c.text('Skipped in test environment', 200)
	}
	try {
		const members = await q.getMembersWithSignatures()
		const execAsync = promisify(exec)
		const downloadsDir = path.join(os.homedir(), 'Downloads')
		const consentsDir = path.join(downloadsDir, 'Consents')
		await fs.mkdir(consentsDir, { recursive: true })

		const errors: string[] = []
		for (const member of members) {
			const pdfPath = path.join(consentsDir, `consent_${member.id}.pdf`)
			const command = `chrome --headless --disable-gpu --print-to-pdf=${pdfPath} http://localhost:3000/members/${member.id}/consent`
			//const command = `brave-browser --headless --disable-gpu --print-to-pdf=${pdfPath} http://localhost:3000/members/${member.id}/consent`
			try {
				await execAsync(command)
			} catch (error) {
				errors.push(`Failed for member ${member.id}: ${(error as Error).message}`)
			}
		}

		if (errors.length > 0) {
			return c.json({ success: false, errors }, 500)
		}
		return c.json({ success: true, message: `Generated ${members.length} consent PDFs` })
	} catch (error) {
		return c.json({ success: false, error: (error as Error).message }, 500)
	}
})

export default settingsRouter
