import { html } from 'hono/html'
import type { JSXNode } from 'hono/jsx'
import type { TFn } from '../middleware/i18n'
import { Nav } from './nav'
import { Visit } from './visit'

interface LayoutProps {
	title: string
	content: ReturnType<typeof html> | JSXNode | string
	script?: ReturnType<typeof html>
	locale?: string
	t?: TFn
}

export function PageLayout({ title, content, script, locale, t }: LayoutProps) {
	const { script: visitScript, markup: visitMarkup } = Visit()
	return html`
		<!DOCTYPE html>
		<html
			lang="${locale}"
			data-locale="${locale}"
			x-data="{ darkMode: localStorage.getItem('darkMode') === 'true' }"
			:class="{ 'dark': darkMode }"
		>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>${title} - ${t ? t('app.name') : 'Adrenalin'}</title>
				<link rel="icon" href="/public/favicon.ico">
				<link rel="icon" type="image/svg+xml" href="/public/favicon.svg">
				<link href="/public/fonts/fonts.css" rel="stylesheet">
				<script>
					(function() {
						const darkMode = localStorage.getItem('darkMode') === 'true'
						if (darkMode) {
							document.documentElement.classList.add('dark')
						}
					})();
				</script>
				<script>
					function setLocale(locale) {
						document.cookie = 'locale=' + locale + '; path=/; max-age=31536000';
						window.location.reload();
					}
					document.addEventListener('DOMContentLoaded', function() {
						const select = document.getElementById('language-select');
						if (select) {
							const currentLocale = document.documentElement.getAttribute('data-locale');
							const cookieMatch = document.cookie.match(/locale=([^;]+)/);
							if (!cookieMatch) {
								document.cookie = 'locale=' + currentLocale + '; path=/; max-age=31536000';
							}
							const locale = cookieMatch ? cookieMatch[1] : currentLocale;
							select.value = locale;
						}
					});
				</script>
				<script src="/public/htmx.js"></script>
				<script src="/public/alpine.js" defer></script>
				${visitScript}
				${script ?? ''}
				<link href="/public/styles.css" rel="stylesheet">
			</head>
			<body class="min-h-screen" x-data="visitPopup">
				${t ? Nav({ t }) : Nav({ t: () => '' })}
				<div id="search-results" class="relative z-10"></div>
				${visitMarkup}
				<div id="main-content">
					${content}
				</div>
			</body>
		</html>
	`
}
