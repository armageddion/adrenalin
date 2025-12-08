import { html } from 'hono/html'
import type { TFn } from '../middleware/i18n'
import type { Member } from '../types'

interface ButtonProps {
	href?: string
	onClick?: string
	className?: string
	children: string
}

export function Button({ href, onClick, className = '', children }: ButtonProps) {
	const baseClass = `flex items-center px-2 py-1 rounded hover:bg-accent ${className}`

	if (href) {
		return html`
			<a href="${href}" class="${baseClass}">
				${children}
			</a>
		`
	}

	return html`
		<button ${onClick ? ` @click="${onClick}"` : ''} class="${baseClass}">
			${children}
		</button>
	`
}

export function Nav({ t }: { t: TFn }) {
	return html`
		<header
			x-data="{
				keydownListener: null,
				init() {
					if (this.keydownListener) {
						window.removeEventListener('keydown', this.keydownListener);
					}
					this.keydownListener = (e) => {
						if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
							e.preventDefault();
							this.$refs.globalSearch.focus();
						}
					};
					window.addEventListener('keydown', this.keydownListener);
					Alpine.store('search', { members: [], highlightedIndex: -1 });
				},
				handleKeydown(e) {
					const store = Alpine.store('search');
					if (e.key === 'ArrowDown') {
						e.preventDefault();
						store.highlightedIndex = Math.min(store.highlightedIndex + 1, store.members.length - 1);
					} else if (e.key === 'ArrowUp') {
						e.preventDefault();
						store.highlightedIndex = Math.max(store.highlightedIndex - 1, -1);
					} else if (e.key === 'Enter') {
						if (store.highlightedIndex >= 0) {
							window.location.href = '/members/' + store.members[store.highlightedIndex].id;
						}
					}
				}
			}"
			x-init="init()"
			class="w-full text-muted-foreground border border-b shrink-0 sticky top-0 bg-background/50 backdrop-blur-lg"
		>
			<nav class="h-full flex gap-1 items-center p-2">
				${Button({ href: '/', children: t('nav.home') })}
				<div class="flex-auto">
					<div class="relative bg-background text-muted-foreground hover:bg-accent rounded border">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="absolute size-5 left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground/50"
						>
							<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21l-4.3-4.3" />
							</g>
						</svg>
						<input
							type="search"
							placeholder="${t('nav.searchPlaceholder')}"
							class="pl-10 pr-2 py-1 max-w-48 w-full"
							x-ref="globalSearch"
							hx-get="/members-search"
							hx-target="#search-results"
							name="q"
							hx-trigger="keyup changed delay:300ms"
							@keydown="handleKeydown"
						/>
					</div>
				</div>
				<a href="/settings" class="flex items-center justify-center size-8 rounded border hover:bg-accent">
					<span class="sr-only">${t('nav.settings.title') || 'Settings'}</span>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5 text-muted-foreground">
						<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
							<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2" />
							<circle cx="12" cy="12" r="3" />
						</g>
					</svg>
				</a>
			</nav>
		</header>
	`
}

export function SearchResults({ members, t }: { members: Member[]; t: TFn }) {
	return html`
		<div id="member-list" class="space-y-2">
			${members.map(
				(m) => html`
				<div class="flex justify-between items-center p-3">
					<div>
						<a href="/members/${m.id}" class="text-primary hover:underline font-semibold">
							${m.first_name} ${m.last_name}
						</a>
						<span class="text-muted-foreground ml-2">${m.card_id}</span>
					</div>
					<div class="space-x-2">
						<button
							hx-get="/members/${m.id}/edit"
							hx-target="#member-form"
							class="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"
						>
							${t('components.searchResults.edit')}
						</button>
						<button
							hx-delete="/members/${m.id}"
							hx-confirm="${t('messages.confirmDelete')}"
							hx-target="#members-list"
							hx-swap="outerHTML"
							class="text-destructive hover:bg-destructive/20 px-3 py-1 rounded"
						>
							${t('components.searchResults.delete')}
						</button>
					</div>
				</div>
			`,
			)}
		</div>
	`
}
