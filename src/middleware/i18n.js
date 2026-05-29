Object.defineProperty(exports, '__esModule', { value: true })
exports.i18nMiddleware = void 0
exports.customLocaleDetector = customLocaleDetector
var hono_1 = require('@intlify/hono')
var cookie_1 = require('hono/cookie')
var en_json_1 = require('../locales/en.json')
var sr_json_1 = require('../locales/sr.json')
function customLocaleDetector(c) {
	var cookieLang = (0, cookie_1.getCookie)(c, 'locale')
	if (cookieLang && ['en', 'sr'].includes(cookieLang)) return cookieLang
	var acceptLang = c.req.header('Accept-Language')
	if (acceptLang) {
		var preferredLang = acceptLang.split(',')[0].split('-')[0]
		if (['en', 'sr'].includes(preferredLang)) return preferredLang
	}
	return 'sr'
}
exports.i18nMiddleware = (0, hono_1.defineIntlifyMiddleware)({
	locale: customLocaleDetector,
	messages: { en: en_json_1.default, sr: sr_json_1.default },
	fallbackLocale: 'sr',
	supportedLanguages: ['en', 'sr'],
})
