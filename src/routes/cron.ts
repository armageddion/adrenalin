import { Hono } from 'hono'
import * as q from '../queries'
import { sendEmail } from './utils'

const cronRouter = new Hono()

cronRouter.post('/cron', async (c) => {
	const secret = c.req.header('X-Secret-Key')
	if (secret !== process.env.CRON_SECRET) {
		return c.text('Unauthorized', 401)
	}
	const members = q.getMembersWithUpcomingExpiries()
	for (const member of members) {
		if (member.email) {
			const subject = 'Package Expiry Reminder'
			const message = `Hi ${member.first_name}, your package expires on ${member.expires_at}. Please renew soon.`
			const sent = await sendEmail(member.email, subject, message)
			if (sent) {
				q.logMessage(member.id, subject, message)
			}
		}
	}
	return c.text('Cron job completed')
})

export default cronRouter
