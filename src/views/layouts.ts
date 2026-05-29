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
	hideNav?: boolean
	t?: TFn
	user?: { username: string; role: string }
}

export function PageLayout({ title, content, script, locale, hideNav, t, user }: LayoutProps) {
	const { script: visitScript, markup: visitMarkup } = Visit(t)
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
				<link rel="icon" type="image/svg+xml" href="/public/logo.svg">
				<link rel="manifest" href="/manifest.json">
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
						const flash = sessionStorage.getItem('flash-toast');
						if (flash) {
							try {
								const { message, type } = JSON.parse(flash);
								showToast(message, type || 'success');
							} catch (e) {}
							sessionStorage.removeItem('flash-toast');
						}
					});
				</script>
				<script src="/public/htmx.js"></script>
				<script>
					function showToast(message, type = 'success', duration = 4000) {
						const container = document.getElementById('toast-container');
						if (!container || !message) return;
						const toast = document.createElement('div');
						toast.textContent = message;
						toast.className =
							'max-w-sm px-4 py-3 rounded-lg shadow-lg border transition-opacity duration-300 opacity-100 ' +
							(type === 'error'
								? 'bg-destructive text-destructive-foreground border-destructive/50'
								: 'bg-primary text-primary-foreground border-primary/50');
						container.appendChild(toast);
						setTimeout(() => {
							toast.style.opacity = '0';
						}, duration - 300);
						setTimeout(() => {
							toast.remove();
						}, duration);
					}

				document.addEventListener('htmx:afterRequest', function (event) {
					const xhr = event.detail.xhr;
					const toastMessage = xhr.getResponseHeader('X-Toast');
					const toastType = xhr.getResponseHeader('X-Toast-Type') || 'success';
					if (toastMessage) {
						const message = decodeURIComponent(toastMessage);
						if (xhr.getResponseHeader('HX-Redirect')) {
							sessionStorage.setItem('flash-toast', JSON.stringify({ message, type: toastType }));
						} else {
							showToast(message, toastType);
						}
					} else if (xhr.status >= 400) {
						const text = xhr.responseText?.trim();
						if (text) showToast(text, 'error');
					}
				});
				</script>
				<script src="/public/alpine.js" defer></script>
				${hideNav ? '' : visitScript}
				${script ?? ''}
				<link href="/public/styles.css" rel="stylesheet">
			</head>
 			<body class="min-h-screen">
				${hideNav ? '' : t ? Nav({ t, user }) : Nav({ t: () => '', user })}
				<div id="toast-container" class="fixed bottom-4 right-4 z-50 flex flex-col gap-3"></div>
				<div id="search-results" class="relative z-10"></div>
				${hideNav ? '' : visitMarkup}
				<main>
					${content}
				</main>
			</body>
		</html>
	`
}
