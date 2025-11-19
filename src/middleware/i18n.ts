import { defineI18nMiddleware } from '@intlify/hono'
import type { Context } from 'hono'
import { getCookie } from 'hono/cookie'
import en from '../locales/en.json'
import sr from '../locales/sr.json'

export function customLocaleDetector(c: Context): string {
	const cookieLang = getCookie(c, 'locale')
	if (cookieLang && ['en', 'sr'].includes(cookieLang)) return cookieLang

	const acceptLang = c.req.header('Accept-Language')
	if (acceptLang) {
		const preferredLang = acceptLang.split(',')[0].split('-')[0]
		if (['en', 'sr'].includes(preferredLang)) return preferredLang
	}

	return 'sr'
}

export const i18nMiddleware = defineI18nMiddleware({
	locale: customLocaleDetector,
	messages: { en, sr },
	fallbackLocale: 'sr',
	supportedLanguages: ['en', 'sr'],
})

export type TFn = (key: string, params?: Record<string, unknown>) => string
