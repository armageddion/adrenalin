import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { customLocaleDetector } from '../middleware/i18n'
import * as q from '../queries'
import { PageLayout } from '../views/layouts'

const registerRouter = new Hono()

registerRouter.get('/register', (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const packages = q.getPackages()

	const signatureScript = html`
		<script src="/public/signature_pad.js"></script>
		<script>
			document.addEventListener('alpine:init', () => {
				Alpine.data('signaturePad', () => ({
					signaturePad: null,
					init() {
						const canvas = document.getElementById('signature-pad');
						if (canvas) {
							this.signaturePad = new SignaturePad(canvas, {
								penColor: document.documentElement.classList.contains('dark') ? 'white' : 'black'
							});
						}
					},
					clearSignature() {
						if (this.signaturePad) {
							this.signaturePad.clear();
						}
					},
					setSignatureData(e) {
						if (this.signaturePad && !this.signaturePad.isEmpty()) {
							const dataUrl = this.signaturePad.toDataURL();
							document.getElementById('signature-input').value = dataUrl;
						}
					}
				}));
			});
		</script>
	`

	const content = html`
		<div class="p-4 w-full">
			<div class="bg-background p-6 rounded-lg shadow-md mb-6 max-w-2xl mx-auto">
				<h3 class="text-xl font-bold mb-4">Member Registration</h3>
				<form
					hx-post="/register"
					hx-target="body"
					hx-swap="none"
					class="space-y-4"
					x-data="signaturePad()"
					x-on:submit="setSignatureData"
				>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-muted-foreground">First Name:</label>
							<input type="text" name="first_name" required class="mt-1 block w-full p-2 border rounded" />
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">Last Name:</label>
							<input type="text" name="last_name" required class="mt-1 block w-full p-2 border rounded" />
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">Email:</label>
							<input type="email" name="email" class="mt-1 block w-full p-2 border rounded" />
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">Phone:</label>
							<input type="tel" name="phone" class="mt-1 block w-full p-2 border rounded" />
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">Card ID:</label>
							<input type="text" name="card_id" required class="mt-1 block w-full p-2 border rounded" />
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">Gov ID:</label>
							<input type="text" name="gov_id" class="mt-1 block w-full p-2 border rounded" />
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">Year of Birth:</label>
							<input type="number" name="year_of_birth" required class="mt-1 block w-full p-2 border rounded" />
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">Package:</label>
							<select name="package_id" class="mt-1 block w-full p-2 border rounded">
								<option value="">None</option>
								${packages.map(
									(p) => html`
									<option value="${p.id}">
										${p.name}-${p.price}€
									</option>
								`,
								)}
							</select>
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">Expiry Date:</label>
							<input type="date" name="expires_at" class="mt-1 block w-full p-2 border rounded" />
						</div>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label class="block text-sm font-medium text-muted-foreground">Address Street:</label>
							<input type="text" name="address_street" class="mt-1 block w-full p-2 border rounded" />
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">Address Number:</label>
							<input type="text" name="address_number" class="mt-1 block w-full p-2 border rounded" />
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">Address City:</label>
							<input type="text" name="address_city" class="mt-1 block w-full p-2 border rounded" />
						</div>
					</div>
					<div x-data="{ isGuardian: false }">
						<label class="block text-sm font-medium text-muted-foreground">
							<input type="checkbox" name="guardian" class="mr-2" x-model="isGuardian" />
							${t('components.memberForm.isGuardian')}
						</label>
						<div
							x-show="isGuardian"
							class="border-l-2 border-primary pl-4 mt-2 space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4"
						>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">Guardian First Name:</label>
								<input type="text" name="guardian_first_name" class="mt-1 block w-full p-2 border rounded" />
							</div>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">Guardian Last Name:</label>
								<input type="text" name="guardian_last_name" class="mt-1 block w-full p-2 border rounded" />
							</div>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">Guardian Gov ID:</label>
								<input type="text" name="guardian_gov_id" class="mt-1 block w-full p-2 border rounded" />
							</div>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium text-muted-foreground">Signature:</label>
						<div class="space-y-2">
							<canvas id="signature-pad" class="border rounded" width="400" height="200"></canvas>
							<div class="flex space-x-2">
								<button
									type="button"
									x-on:click="clearSignature()"
									class="text-destructive hover:bg-destructive/20 px-4 py-2 rounded"
								>
									Clear
								</button>
							</div>
							<input type="hidden" name="signature" id="signature-input" />
						</div>
					</div>
					<div class="flex space-x-2">
						<button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">
							Register
						</button>
					</div>
				</form>
			</div>
		</div>
	`

	return c.html(PageLayout({ title: 'Register', content, script: signatureScript, t, locale }))
})

registerRouter.post('/register', async (c) => {
	const body = await c.req.parseBody()
	const member = {
		first_name: body.first_name as string,
		last_name: body.last_name as string,
		email: (body.email as string) || undefined,
		phone: (body.phone as string) || undefined,
		card_id: body.card_id as string,
		gov_id: (body.gov_id as string) || undefined,
		package_id: body.package_id ? Number.parseInt(body.package_id as string, 10) : undefined,
		expires_at: (body.expires_at as string) || undefined,
		image: (body.image as string) || undefined,
		notes: (body.notes as string) || undefined,
		address_street: (body.address_street as string) || undefined,
		address_number: (body.address_number as string) || undefined,
		address_city: (body.address_city as string) || undefined,
		guardian: body.guardian === 'on' ? 1 : 0,
		guardian_first_name: (body.guardian_first_name as string) || undefined,
		guardian_last_name: (body.guardian_last_name as string) || undefined,
		guardian_gov_id: (body.guardian_gov_id as string) || undefined,
		notify: body.notify !== 'off' ? 1 : 0,
		year_of_birth: Number.parseInt(body.year_of_birth as string, 10),
	}
	q.addMember(member)
	c.header('HX-Redirect', '/members')
	return c.text('', 200)
})

export default registerRouter
