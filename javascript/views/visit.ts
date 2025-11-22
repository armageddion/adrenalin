import { html } from 'hono/html'

export function Visit() {
	const script = html`
		<script>
			document.addEventListener('alpine:init', () => {
				Alpine.data('visitPopup', () => ({
					showVisitPopup: false,
					cardDigits: '',
					cardTimeout: null,
					keydownListener: null,
					isCancelled: false,
					isQuerying: false,
					init() {
						this.showVisitPopup = false;
						this.cardDigits = '';
						this.isCancelled = false;
						this.isQuerying = false;
						sessionStorage.removeItem('visitQueryInProgress');
						if (this.keydownListener) {
							window.removeEventListener('keydown', this.keydownListener);
						}
						this.keydownListener = (e) => {
							if (e.key === 'Escape') {
								this.isCancelled = true;
								this.closeCardPopup();
							} else if (e.key.length === 1 && /[0-9]/.test(e.key) && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
								this.cardDigits += e.key;
								this.showVisitPopup = true;
								this.isCancelled = false;
								if (this.cardTimeout) clearTimeout(this.cardTimeout);
								this.cardTimeout = setTimeout(() => {
									this.queryCard();
								}, 1500); // Query after 1.5 seconds of no input
							}
						};
						window.addEventListener('keydown', this.keydownListener);
					},
					queryCard() {
						if (sessionStorage.getItem('visitQueryInProgress') === 'true') return;
						if (this.cardTimeout) clearTimeout(this.cardTimeout);
						if (this.isQuerying) return;
						if (this.cardDigits && !this.isCancelled) {
							this.isQuerying = true;
							sessionStorage.setItem('visitQueryInProgress', 'true');
							fetch('/visit-input?q=' + encodeURIComponent(this.cardDigits))
								.then(response => {
									// Check if it's a redirect response
									const redirectUrl = response.headers.get('HX-Redirect');
									if (redirectUrl) {
										// Handle redirect manually since we're using fetch, not HTMX
										window.location.href = redirectUrl;
										return;
									}
									return response.text();
								})
								.then(html => {
									if (html) {
										this.$el.querySelector('[x-ref="cardResults"]').innerHTML = html;
									}
									this.cardDigits = '';
									this.isCancelled = false;
									if (this.cardTimeout) clearTimeout(this.cardTimeout);
									this.isQuerying = false;
									sessionStorage.removeItem('visitQueryInProgress');
								})
								.catch(err => {
									console.error('Error querying card:', err);
									this.isQuerying = false;
									sessionStorage.removeItem('visitQueryInProgress');
								});
						}
					},
					closeCardPopup() {
						if (this.cardTimeout) clearTimeout(this.cardTimeout);
						this.showVisitPopup = false;
						this.cardDigits = '';
						this.isQuerying = false;
						sessionStorage.removeItem('visitQueryInProgress');
					}
				}));
			});
		</script>
	`

	const markup = html`
		<div
			x-data="visitPopup"
			x-cloak
			x-show="showVisitPopup"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
		>
			<div class="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-lg font-semibold">Card ID Query</h3>
					<button @click="closeCardPopup()" class="text-muted-foreground hover:text-foreground">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5">
							<path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M18 6L6 18M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<div class="mb-4">
					<label class="block text-sm font-medium text-muted-foreground mb-2">
						Enter Card ID
					</label>
					<input
						type="text"
						x-model="cardDigits"
						@keydown.enter="queryCard()"
						class="w-full p-2 border rounded"
						placeholder="Type digits..."
						autofocus
					/>
				</div>
				<div x-ref="cardResults" class="min-h-16"></div>
				<div class="flex justify-end space-x-2 mt-4">
					<button
						@click="queryCard()"
						class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded"
					>
						Query
					</button>
					<button
						@click="closeCardPopup()"
						class="text-muted-foreground hover:text-foreground px-4 py-2 rounded border"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	`

	return { script, markup }
}
