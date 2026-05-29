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
exports.Settings = Settings
var html_1 = require('hono/html')
function Settings(_a) {
	var t = _a.t,
		locale = _a.locale,
		ip = _a.ip
	return (0, html_1.html)(
		templateObject_1 ||
			(templateObject_1 = __makeTemplateObject(
				[
					"\n\t\t<script>\n\t\t\tconst ipcRenderer = typeof require !== 'undefined' ? require('electron').ipcRenderer : null;\n\t\t</script>\n\t\t<div\n\t\t\tclass=\"mt-8 container max-w-md bg-card p-6 rounded-lg shadow-md\"\n\t\t\tx-data=\"{\n\t\t\t\tcurrentTheme: darkMode ? 'dark' : 'light',\n\t\t\t\tcurrentLanguage: '",
					"',\n\t\t\t\tcurrentApiKey: '',\n\t\t\t\tasync initApiKey() {\n\t\t\t\t\tconst key = await ipcRenderer?.invoke('get-resend-api-key');\n\t\t\t\t\tthis.currentApiKey = key || localStorage.getItem('RESEND_API_KEY') || '';\n\t\t\t\t},\n\t\t\t\tasync setApiKey() {\n\t\t\t\t\tawait ipcRenderer?.invoke('set-resend-api-key', this.currentApiKey);\n\t\t\t\t\tlocalStorage.setItem('RESEND_API_KEY', this.currentApiKey);\n\t\t\t\t\tipcRenderer?.send('restart-server');\n\t\t\t\t},\n\t\t\t\tsetTheme(theme) {\n\t\t\t\t\tthis.currentTheme = theme;\n\t\t\t\t\tif (theme === 'dark') {\n\t\t\t\t\t\tdarkMode = true;\n\t\t\t\t\t\tlocalStorage.setItem('darkMode', true);\n\t\t\t\t\t\tdocument.documentElement.classList.add('dark');\n\t\t\t\t\t} else {\n\t\t\t\t\t\tdarkMode = false;\n\t\t\t\t\t\tlocalStorage.setItem('darkMode', false);\n\t\t\t\t\t\tdocument.documentElement.classList.remove('dark');\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tsetLanguage(lang) {\n\t\t\t\t\tthis.currentLanguage = lang;\n\t\t\t\t\tsetLocale(lang);\n\t\t\t\t},\n\t\t\t\tasync printConsents() {\n\t\t\t\t\ttry {\n\t\t\t\t\t\tconst response = await fetch('/settings/print-consents', { method: 'POST' });\n\t\t\t\t\t\tif (response.ok) {\n\t\t\t\t\t\t\talert('Consents printed successfully!');\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\talert('Error printing consents.');\n\t\t\t\t\t\t}\n\t\t\t\t\t} catch (error) {\n\t\t\t\t\t\talert('Error: ' + error.message);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\"\n\t\t\tx-init=\"initApiKey()\"\n\t\t>\n\t\t\t<h2 class=\"text-2xl font-bold mb-4\">",
					'</h2>\n\t\t\t<div class="space-y-4">\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground mb-2">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tx-on:click="setTheme(\'light\')"\n\t\t\t\t\t\t\tx-bind:class="currentTheme === \'light\' ? \'bg-primary text-primary-foreground\' : \'bg-muted text-muted-foreground hover:bg-muted/80\'"\n\t\t\t\t\t\t\tclass="px-4 py-2 rounded"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					"\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tx-on:click=\"setTheme('dark')\"\n\t\t\t\t\t\t\tx-bind:class=\"currentTheme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'\"\n\t\t\t\t\t\t\tclass=\"px-4 py-2 rounded\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t",
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground mb-2">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tx-on:click="setLanguage(\'en\')"\n\t\t\t\t\t\t\tx-bind:class="currentLanguage === \'en\' ? \'bg-primary text-primary-foreground\' : \'bg-muted text-muted-foreground hover:bg-muted/80\'"\n\t\t\t\t\t\t\tclass="px-4 py-2 rounded"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					"\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tx-on:click=\"setLanguage('sr')\"\n\t\t\t\t\t\t\tx-bind:class=\"currentLanguage === 'sr' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'\"\n\t\t\t\t\t\t\tclass=\"px-4 py-2 rounded\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t",
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground mb-2">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t\t<a\n\t\t\t\t\t\thref="/packages"\n\t\t\t\t\t\tclass="inline-block h-10 px-4 py-2 rounded bg-primary text-primary-foreground"\n\t\t\t\t\t>\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground mb-2">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class="flex items-center space-x-2">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\ttype="password"\n\t\t\t\t\t\t\tx-model="currentApiKey"\n\t\t\t\t\t\t\tclass="w-full px-3 py-2 border border-input rounded bg-background text-foreground"\n\t\t\t\t\t\t\tplaceholder="Enter Resend API Key"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tx-on:click="setApiKey()"\n\t\t\t\t\t\t\tclass="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground mb-2">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class="px-3 py-2 border border-input rounded bg-muted text-muted-foreground">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<button\n\t\t\t\t\t\tx-on:click="printConsents()"\n\t\t\t\t\t\tclass="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80"\n\t\t\t\t\t>\n\t\t\t\t\t\tPrint Consents\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t',
				],
				[
					"\n\t\t<script>\n\t\t\tconst ipcRenderer = typeof require !== 'undefined' ? require('electron').ipcRenderer : null;\n\t\t</script>\n\t\t<div\n\t\t\tclass=\"mt-8 container max-w-md bg-card p-6 rounded-lg shadow-md\"\n\t\t\tx-data=\"{\n\t\t\t\tcurrentTheme: darkMode ? 'dark' : 'light',\n\t\t\t\tcurrentLanguage: '",
					"',\n\t\t\t\tcurrentApiKey: '',\n\t\t\t\tasync initApiKey() {\n\t\t\t\t\tconst key = await ipcRenderer?.invoke('get-resend-api-key');\n\t\t\t\t\tthis.currentApiKey = key || localStorage.getItem('RESEND_API_KEY') || '';\n\t\t\t\t},\n\t\t\t\tasync setApiKey() {\n\t\t\t\t\tawait ipcRenderer?.invoke('set-resend-api-key', this.currentApiKey);\n\t\t\t\t\tlocalStorage.setItem('RESEND_API_KEY', this.currentApiKey);\n\t\t\t\t\tipcRenderer?.send('restart-server');\n\t\t\t\t},\n\t\t\t\tsetTheme(theme) {\n\t\t\t\t\tthis.currentTheme = theme;\n\t\t\t\t\tif (theme === 'dark') {\n\t\t\t\t\t\tdarkMode = true;\n\t\t\t\t\t\tlocalStorage.setItem('darkMode', true);\n\t\t\t\t\t\tdocument.documentElement.classList.add('dark');\n\t\t\t\t\t} else {\n\t\t\t\t\t\tdarkMode = false;\n\t\t\t\t\t\tlocalStorage.setItem('darkMode', false);\n\t\t\t\t\t\tdocument.documentElement.classList.remove('dark');\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tsetLanguage(lang) {\n\t\t\t\t\tthis.currentLanguage = lang;\n\t\t\t\t\tsetLocale(lang);\n\t\t\t\t},\n\t\t\t\tasync printConsents() {\n\t\t\t\t\ttry {\n\t\t\t\t\t\tconst response = await fetch('/settings/print-consents', { method: 'POST' });\n\t\t\t\t\t\tif (response.ok) {\n\t\t\t\t\t\t\talert('Consents printed successfully!');\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\talert('Error printing consents.');\n\t\t\t\t\t\t}\n\t\t\t\t\t} catch (error) {\n\t\t\t\t\t\talert('Error: ' + error.message);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\"\n\t\t\tx-init=\"initApiKey()\"\n\t\t>\n\t\t\t<h2 class=\"text-2xl font-bold mb-4\">",
					'</h2>\n\t\t\t<div class="space-y-4">\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground mb-2">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tx-on:click="setTheme(\'light\')"\n\t\t\t\t\t\t\tx-bind:class="currentTheme === \'light\' ? \'bg-primary text-primary-foreground\' : \'bg-muted text-muted-foreground hover:bg-muted/80\'"\n\t\t\t\t\t\t\tclass="px-4 py-2 rounded"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					"\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tx-on:click=\"setTheme('dark')\"\n\t\t\t\t\t\t\tx-bind:class=\"currentTheme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'\"\n\t\t\t\t\t\t\tclass=\"px-4 py-2 rounded\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t",
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground mb-2">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class="flex space-x-2">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tx-on:click="setLanguage(\'en\')"\n\t\t\t\t\t\t\tx-bind:class="currentLanguage === \'en\' ? \'bg-primary text-primary-foreground\' : \'bg-muted text-muted-foreground hover:bg-muted/80\'"\n\t\t\t\t\t\t\tclass="px-4 py-2 rounded"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					"\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tx-on:click=\"setLanguage('sr')\"\n\t\t\t\t\t\t\tx-bind:class=\"currentLanguage === 'sr' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'\"\n\t\t\t\t\t\t\tclass=\"px-4 py-2 rounded\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t",
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground mb-2">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t\t<a\n\t\t\t\t\t\thref="/packages"\n\t\t\t\t\t\tclass="inline-block h-10 px-4 py-2 rounded bg-primary text-primary-foreground"\n\t\t\t\t\t>\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground mb-2">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class="flex items-center space-x-2">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\ttype="password"\n\t\t\t\t\t\t\tx-model="currentApiKey"\n\t\t\t\t\t\t\tclass="w-full px-3 py-2 border border-input rounded bg-background text-foreground"\n\t\t\t\t\t\t\tplaceholder="Enter Resend API Key"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tx-on:click="setApiKey()"\n\t\t\t\t\t\t\tclass="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t',
					'\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="block text-sm font-medium text-muted-foreground mb-2">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class="px-3 py-2 border border-input rounded bg-muted text-muted-foreground">\n\t\t\t\t\t\t',
					'\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<button\n\t\t\t\t\t\tx-on:click="printConsents()"\n\t\t\t\t\t\tclass="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80"\n\t\t\t\t\t>\n\t\t\t\t\t\tPrint Consents\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t',
				],
			)),
		locale,
		t('settings.title') || 'Settings',
		t('settings.theme') || 'Theme',
		t('settings.lightMode') || 'Light Mode',
		t('settings.darkMode') || 'Dark Mode',
		t('settings.language') || 'Language',
		t('settings.english') || 'English',
		t('settings.serbian') || 'Serbian',
		t('nav.packages') || 'Language',
		t('nav.packages') || 'Packages',
		t('settings.resend') || 'Resend API Key',
		t('save') || 'Save',
		t('settings.serverIp') || 'Server IP',
		ip,
	)
}
var templateObject_1
