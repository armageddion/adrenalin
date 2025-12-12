import { defineIntlifyMiddleware } from '@intlify/hono'
import type { Context } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import en from '../locales/en.json'
import sr from '../locales/sr.json'
import ru from '../locales/ru.json'

// Re-declared locally since TranslationFunction is not exported from @intlify/hono
// This matches the internal interface used by the package for the translation function
interface TranslationFunction {
	(key: string): string
	(key: string, plural: number): string
	(key: string, plural: number, options: Record<string, unknown>): string
	(key: string, defaultMsg: string): string
	(key: string, defaultMsg: string, options: Record<string, unknown>): string
	(key: string, list: unknown[]): string
	(key: string, list: unknown[], plural: number): string
	(key: string, list: unknown[], defaultMsg: string): string
	(key: string, list: unknown[], options: Record<string, unknown>): string
	(key: string, named: Record<string, unknown>): string
	(key: string, named: Record<string, unknown>, plural: number): string
	(key: string, named: Record<string, unknown>, defaultMsg: string): string
	(key: string, named: Record<string, unknown>, options: Record<string, unknown>): string
}

export function customLocaleDetector(c: Context): string {
	// Check query parameter first (e.g., ?lang=en)
	const queryLang = c.req.query('lang')
	if (queryLang && ['en', 'sr', 'ru'].includes(queryLang)) {
		setCookie(c, 'locale', queryLang, { path: '/', maxAge: 31536000 }) // 1 year
		return queryLang
	}

	const cookieLang = getCookie(c, 'locale')
	if (cookieLang && ['en', 'sr', 'ru'].includes(cookieLang)) return cookieLang

	const acceptLang = c.req.header('Accept-Language')
	if (acceptLang) {
		const preferredLang = acceptLang.split(',')[0].split('-')[0]
		if (['en', 'sr', 'ru'].includes(preferredLang)) return preferredLang
	}

	return 'sr'
}

export const i18nMiddleware = defineIntlifyMiddleware({
	locale: customLocaleDetector,
	messages: { en, sr, ru },
	fallbackLocale: 'sr',
	supportedLanguages: ['en', 'sr', 'ru'],
})

export type TFn = TranslationFunction
