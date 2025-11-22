import type { Context } from 'hono'
import type { TFn } from '../middleware/i18n'

export function notFoundResponse(c: Context, t: TFn, entity: string): Response {
	return c.text(t(`messages.${entity}NotFound`), 404)
}

export async function sendEmail(to: string, subject: string, message: string): Promise<boolean> {
	// For now, simulate email sending. In production, use Resend
	return fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: 'noreply@yourapp.com',
			to: [to],
			subject,
			html: message,
		}),
	})
		.then((res) => res.ok)
		.catch(() => false)
}
