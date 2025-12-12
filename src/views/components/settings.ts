import { html } from 'hono/html'
import type { TFn } from '../../middleware/i18n'

export function Settings({ t, locale, ip }: { t: TFn; locale: string; ip: string }) {
	return html`
		<script>
			const ipcRenderer = typeof require !== 'undefined' ? require('electron').ipcRenderer : null;
		</script>
		<div
			class="mt-8 container max-w-md bg-card p-6 rounded-lg shadow-md"
			x-data="{
				currentTheme: darkMode ? 'dark' : 'light',
				currentLanguage: '${locale}',
				currentApiKey: '',
				async initApiKey() {
					const key = await ipcRenderer?.invoke('get-resend-api-key');
					this.currentApiKey = key || localStorage.getItem('RESEND_API_KEY') || '';
				},
				async setApiKey() {
					await ipcRenderer?.invoke('set-resend-api-key', this.currentApiKey);
					localStorage.setItem('RESEND_API_KEY', this.currentApiKey);
					ipcRenderer?.send('restart-server');
				},
				setTheme(theme) {
					this.currentTheme = theme;
					if (theme === 'dark') {
						darkMode = true;
						localStorage.setItem('darkMode', true);
						document.documentElement.classList.add('dark');
					} else {
						darkMode = false;
						localStorage.setItem('darkMode', false);
						document.documentElement.classList.remove('dark');
					}
				},
				setLanguage(lang) {
					this.currentLanguage = lang;
					setLocale(lang);
				},
				async printConsents() {
					try {
						const response = await fetch('/settings/print-consents', { method: 'POST' });
						if (response.ok) {
							alert('Consents printed successfully!');
						} else {
							alert('Error printing consents.');
						}
					} catch (error) {
						alert('Error: ' + error.message);
					}
				}
			}"
			x-init="initApiKey()"
		>
			<h2 class="text-2xl font-bold mb-4">${t('settings.title') || 'Settings'}</h2>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-muted-foreground mb-2">
						${t('settings.theme') || 'Theme'}
					</label>
					<div class="flex space-x-2">
						<button
							x-on:click="setTheme('light')"
							x-bind:class="currentTheme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
							class="px-4 py-2 rounded"
						>
							${t('settings.lightMode') || 'Light Mode'}
						</button>
						<button
							x-on:click="setTheme('dark')"
							x-bind:class="currentTheme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
							class="px-4 py-2 rounded"
						>
							${t('settings.darkMode') || 'Dark Mode'}
						</button>
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground mb-2">
						${t('settings.language') || 'Language'}
					</label>
					<div class="flex space-x-2">
						<button
							x-on:click="setLanguage('en')"
							x-bind:class="currentLanguage === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
							class="px-4 py-2 rounded"
						>
							${t('settings.english') || 'English'}
						</button>
						<button
							x-on:click="setLanguage('sr')"
							x-bind:class="currentLanguage === 'sr' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
							class="px-4 py-2 rounded"
						>
							${t('settings.serbian') || 'Serbian'}
						</button>
						<button
							x-on:click="setLanguage('ru')"
							x-bind:class="currentLanguage === 'ru' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
							class="px-4 py-2 rounded"
						>
							${t('settings.russian') || 'Russian'}
						</button>
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground mb-2">
						${t('nav.packages') || 'Language'}
					</label>
					<a
						href="/packages"
						class="inline-block h-10 px-4 py-2 rounded bg-primary text-primary-foreground"
					>
						${t('nav.packages') || 'Packages'}
					</a>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground mb-2">
						${t('settings.resend') || 'Resend API Key'}
					</label>
					<div class="flex items-center space-x-2">
						<input
							type="password"
							x-model="currentApiKey"
							class="w-full px-3 py-2 border border-input rounded bg-background text-foreground"
							placeholder="Enter Resend API Key"
						/>
						<button
							x-on:click="setApiKey()"
							class="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80"
						>
							${t('save') || 'Save'}
						</button>
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground mb-2">
						${t('settings.serverIp') || 'Server IP'}
					</label>
					<div class="px-3 py-2 border border-input rounded bg-muted text-muted-foreground">
						${ip}
					</div>
				</div>
				<div>
					<button
						x-on:click="printConsents()"
						class="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80"
					>
						Print Consents
					</button>
				</div>
			</div>
		</div>
	`
}
