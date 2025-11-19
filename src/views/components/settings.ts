import { html } from 'hono/html'
import type { TFn } from '../../middleware/i18n'

export function Settings({ t, locale }: { t: TFn; locale: string }) {
	return html`
 		<div
 			class="mt-8 container max-w-md bg-card p-6 rounded-lg shadow-md"
 			x-data="{
 				currentTheme: darkMode ? 'dark' : 'light',
 				currentLanguage: '${locale}',
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
 				}
 			}"
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
 					</div>
 				</div>
 			</div>
 		</div>
 	`
}
