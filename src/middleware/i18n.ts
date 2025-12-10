import { defineIntlifyMiddleware } from '@intlify/hono'
import type { Context } from 'hono'
import { getCookie } from 'hono/cookie'
import en from '../locales/en.json'
import sr from '../locales/sr.json'

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
	const cookieLang = getCookie(c, 'locale')
	if (cookieLang && ['en', 'sr'].includes(cookieLang)) return cookieLang

	const acceptLang = c.req.header('Accept-Language')
	if (acceptLang) {
		const preferredLang = acceptLang.split(',')[0].split('-')[0]
		if (['en', 'sr'].includes(preferredLang)) return preferredLang
	}

	return 'sr'
}

export const i18nMiddleware = defineIntlifyMiddleware({
	locale: customLocaleDetector,
	messages: { en, sr },
	fallbackLocale: 'sr',
	supportedLanguages: ['en', 'sr'],
})

export type TFn = TranslationFunction
