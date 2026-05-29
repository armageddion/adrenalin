var __makeTemplateObject =
	(this && this.__makeTemplateObject) ||
	((cooked, raw) => {
		if (Object.defineProperty) {
			Object.defineProperty(cooked, 'raw', { value: raw })
		} else {
			cooked.raw = raw
		}
		return cooked
	})
Object.defineProperty(exports, '__esModule', { value: true })
exports.PageLayout = PageLayout
var html_1 = require('hono/html')
var nav_1 = require('./nav')
var visit_1 = require('./visit')
function PageLayout(_a) {
	var title = _a.title,
		content = _a.content,
		script = _a.script,
		locale = _a.locale,
		hideNav = _a.hideNav,
		t = _a.t,
		user = _a.user
	var _b = (0, visit_1.Visit)(t),
		visitScript = _b.script,
		visitMarkup = _b.markup
	return (0, html_1.html)(
		templateObject_1 ||
			(templateObject_1 = __makeTemplateObject(
				[
					'\n\t\t<!DOCTYPE html>\n\t\t<html\n\t\t\tlang="',
					'"\n\t\t\tdata-locale="',
					'"\n\t\t\tx-data="{ darkMode: localStorage.getItem(\'darkMode\') === \'true\' }"\n\t\t\t:class="{ \'dark\': darkMode }"\n\t\t>\n\t\t\t<head>\n\t\t\t\t<meta charset="UTF-8">\n\t\t\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t\t\t\t<title>',
					' - ',
					"</title>\n\t\t\t\t<link rel=\"icon\" href=\"/public/favicon.ico\">\n\t\t\t\t<link rel=\"icon\" type=\"image/svg+xml\" href=\"/public/logo.svg\">\n\t\t\t\t<link rel=\"manifest\" href=\"/manifest.json\">\n\t\t\t\t<link href=\"/public/fonts/fonts.css\" rel=\"stylesheet\">\n\t\t\t\t<script>\n\t\t\t\t\t(function() {\n\t\t\t\t\t\tconst darkMode = localStorage.getItem('darkMode') === 'true'\n\t\t\t\t\t\tif (darkMode) {\n\t\t\t\t\t\t\tdocument.documentElement.classList.add('dark')\n\t\t\t\t\t\t}\n\t\t\t\t\t})();\n\t\t\t\t</script>\n\t\t\t\t<script>\n\t\t\t\t\tfunction setLocale(locale) {\n\t\t\t\t\t\tdocument.cookie = 'locale=' + locale + '; path=/; max-age=31536000';\n\t\t\t\t\t\twindow.location.reload();\n\t\t\t\t\t}\n\t\t\t\t\tdocument.addEventListener('DOMContentLoaded', function() {\n\t\t\t\t\t\tconst select = document.getElementById('language-select');\n\t\t\t\t\t\tif (select) {\n\t\t\t\t\t\t\tconst currentLocale = document.documentElement.getAttribute('data-locale');\n\t\t\t\t\t\t\tconst cookieMatch = document.cookie.match(/locale=([^;]+)/);\n\t\t\t\t\t\t\tif (!cookieMatch) {\n\t\t\t\t\t\t\t\tdocument.cookie = 'locale=' + currentLocale + '; path=/; max-age=31536000';\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tconst locale = cookieMatch ? cookieMatch[1] : currentLocale;\n\t\t\t\t\t\t\tselect.value = locale;\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t</script>\n\t\t\t\t<script src=\"/public/htmx.js\"></script>\n\t\t\t\t<script>\n\t\t\t\t\tfunction showToast(message, type = 'success', duration = 4000) {\n\t\t\t\t\t\tconst container = document.getElementById('toast-container');\n\t\t\t\t\t\tif (!container || !message) return;\n\t\t\t\t\t\tconst toast = document.createElement('div');\n\t\t\t\t\t\ttoast.textContent = message;\n\t\t\t\t\t\ttoast.className =\n\t\t\t\t\t\t\t'max-w-sm px-4 py-3 rounded-lg shadow-lg border transition-opacity duration-300 opacity-100 ' +\n\t\t\t\t\t\t\t(type === 'error'\n\t\t\t\t\t\t\t\t? 'bg-destructive text-destructive-foreground border-destructive/50'\n\t\t\t\t\t\t\t\t: 'bg-primary text-primary-foreground border-primary/50');\n\t\t\t\t\t\tcontainer.appendChild(toast);\n\t\t\t\t\t\tsetTimeout(() => {\n\t\t\t\t\t\t\ttoast.style.opacity = '0';\n\t\t\t\t\t\t}, duration - 300);\n\t\t\t\t\t\tsetTimeout(() => {\n\t\t\t\t\t\t\ttoast.remove();\n\t\t\t\t\t\t}, duration);\n\t\t\t\t\t}\n\n\t\t\t\t\tdocument.addEventListener('htmx:afterRequest', function (event) {\n\t\t\t\t\t\tconst xhr = event.detail.xhr;\n\t\t\t\t\t\tconst toastMessage = xhr.getResponseHeader('X-Toast');\n\t\t\t\t\t\tconst toastType = xhr.getResponseHeader('X-Toast-Type') || 'success';\n\t\t\t\t\t\tif (toastMessage) {\n\t\t\t\t\t\t\tshowToast(toastMessage, toastType);\n\t\t\t\t\t\t} else if (xhr.status >= 400) {\n\t\t\t\t\t\t\tconst text = xhr.responseText?.trim();\n\t\t\t\t\t\t\tif (text) showToast(text, 'error');\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t</script>\n\t\t\t\t<script src=\"/public/alpine.js\" defer></script>\n\t\t\t\t",
					'\n\t\t\t\t',
					'\n\t\t\t\t<link href="/public/styles.css" rel="stylesheet">\n\t\t\t</head>\n \t\t\t<body class="min-h-screen">\n\t\t\t\t',
					'\n\t\t\t\t<div id="toast-container" class="fixed bottom-4 right-4 z-50 flex flex-col gap-3"></div>\n\t\t\t\t<div id="search-results" class="relative z-10"></div>\n\t\t\t\t',
					'\n\t\t\t\t<main>\n\t\t\t\t\t',
					'\n\t\t\t\t</main>\n\t\t\t</body>\n\t\t</html>\n\t',
				],
				[
					'\n\t\t<!DOCTYPE html>\n\t\t<html\n\t\t\tlang="',
					'"\n\t\t\tdata-locale="',
					'"\n\t\t\tx-data="{ darkMode: localStorage.getItem(\'darkMode\') === \'true\' }"\n\t\t\t:class="{ \'dark\': darkMode }"\n\t\t>\n\t\t\t<head>\n\t\t\t\t<meta charset="UTF-8">\n\t\t\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t\t\t\t<title>',
					' - ',
					"</title>\n\t\t\t\t<link rel=\"icon\" href=\"/public/favicon.ico\">\n\t\t\t\t<link rel=\"icon\" type=\"image/svg+xml\" href=\"/public/logo.svg\">\n\t\t\t\t<link rel=\"manifest\" href=\"/manifest.json\">\n\t\t\t\t<link href=\"/public/fonts/fonts.css\" rel=\"stylesheet\">\n\t\t\t\t<script>\n\t\t\t\t\t(function() {\n\t\t\t\t\t\tconst darkMode = localStorage.getItem('darkMode') === 'true'\n\t\t\t\t\t\tif (darkMode) {\n\t\t\t\t\t\t\tdocument.documentElement.classList.add('dark')\n\t\t\t\t\t\t}\n\t\t\t\t\t})();\n\t\t\t\t</script>\n\t\t\t\t<script>\n\t\t\t\t\tfunction setLocale(locale) {\n\t\t\t\t\t\tdocument.cookie = 'locale=' + locale + '; path=/; max-age=31536000';\n\t\t\t\t\t\twindow.location.reload();\n\t\t\t\t\t}\n\t\t\t\t\tdocument.addEventListener('DOMContentLoaded', function() {\n\t\t\t\t\t\tconst select = document.getElementById('language-select');\n\t\t\t\t\t\tif (select) {\n\t\t\t\t\t\t\tconst currentLocale = document.documentElement.getAttribute('data-locale');\n\t\t\t\t\t\t\tconst cookieMatch = document.cookie.match(/locale=([^;]+)/);\n\t\t\t\t\t\t\tif (!cookieMatch) {\n\t\t\t\t\t\t\t\tdocument.cookie = 'locale=' + currentLocale + '; path=/; max-age=31536000';\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tconst locale = cookieMatch ? cookieMatch[1] : currentLocale;\n\t\t\t\t\t\t\tselect.value = locale;\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t</script>\n\t\t\t\t<script src=\"/public/htmx.js\"></script>\n\t\t\t\t<script>\n\t\t\t\t\tfunction showToast(message, type = 'success', duration = 4000) {\n\t\t\t\t\t\tconst container = document.getElementById('toast-container');\n\t\t\t\t\t\tif (!container || !message) return;\n\t\t\t\t\t\tconst toast = document.createElement('div');\n\t\t\t\t\t\ttoast.textContent = message;\n\t\t\t\t\t\ttoast.className =\n\t\t\t\t\t\t\t'max-w-sm px-4 py-3 rounded-lg shadow-lg border transition-opacity duration-300 opacity-100 ' +\n\t\t\t\t\t\t\t(type === 'error'\n\t\t\t\t\t\t\t\t? 'bg-destructive text-destructive-foreground border-destructive/50'\n\t\t\t\t\t\t\t\t: 'bg-primary text-primary-foreground border-primary/50');\n\t\t\t\t\t\tcontainer.appendChild(toast);\n\t\t\t\t\t\tsetTimeout(() => {\n\t\t\t\t\t\t\ttoast.style.opacity = '0';\n\t\t\t\t\t\t}, duration - 300);\n\t\t\t\t\t\tsetTimeout(() => {\n\t\t\t\t\t\t\ttoast.remove();\n\t\t\t\t\t\t}, duration);\n\t\t\t\t\t}\n\n\t\t\t\t\tdocument.addEventListener('htmx:afterRequest', function (event) {\n\t\t\t\t\t\tconst xhr = event.detail.xhr;\n\t\t\t\t\t\tconst toastMessage = xhr.getResponseHeader('X-Toast');\n\t\t\t\t\t\tconst toastType = xhr.getResponseHeader('X-Toast-Type') || 'success';\n\t\t\t\t\t\tif (toastMessage) {\n\t\t\t\t\t\t\tshowToast(toastMessage, toastType);\n\t\t\t\t\t\t} else if (xhr.status >= 400) {\n\t\t\t\t\t\t\tconst text = xhr.responseText?.trim();\n\t\t\t\t\t\t\tif (text) showToast(text, 'error');\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t</script>\n\t\t\t\t<script src=\"/public/alpine.js\" defer></script>\n\t\t\t\t",
					'\n\t\t\t\t',
					'\n\t\t\t\t<link href="/public/styles.css" rel="stylesheet">\n\t\t\t</head>\n \t\t\t<body class="min-h-screen">\n\t\t\t\t',
					'\n\t\t\t\t<div id="toast-container" class="fixed bottom-4 right-4 z-50 flex flex-col gap-3"></div>\n\t\t\t\t<div id="search-results" class="relative z-10"></div>\n\t\t\t\t',
					'\n\t\t\t\t<main>\n\t\t\t\t\t',
					'\n\t\t\t\t</main>\n\t\t\t</body>\n\t\t</html>\n\t',
				],
			)),
		locale,
		locale,
		title,
		t ? t('app.name') : 'Adrenalin',
		hideNav ? '' : visitScript,
		script !== null && script !== void 0 ? script : '',
		hideNav ? '' : t ? (0, nav_1.Nav)({ t: t, user: user }) : (0, nav_1.Nav)({ t: () => '', user: user }),
		hideNav ? '' : visitMarkup,
		content,
	)
}
var templateObject_1
