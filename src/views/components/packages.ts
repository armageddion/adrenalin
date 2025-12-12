import { html } from 'hono/html'
import type { TFn } from '../../middleware/i18n'
import type { Package } from '../../types'

export function PackageList({ packages, t }: { packages: Package[]; t: TFn }) {
	return html`
 		<div id="package-list-container" class="bg-background p-6 rounded-lg shadow-md">
 			<h2 class="text-2xl font-bold mb-4">${t('components.packageList.title')}</h2>
 			<div id="packages-list" class="space-y-2">
 				${packages.map(
					(p) => html`
 					<div class="flex justify-between items-center p-3 bg-card rounded">
 						<div class="space-y-2">
 							<h4 class="font-semibold">
 								${p.name} - ${p.price}
 								&nbsp;RSD
 							</h4>
 							<p class="text-sm text-muted-foreground">${p.description}</p>
 						</div>
 						<div class="space-x-2">
 							<button
 								hx-get="/packages/${p.id}/edit"
 								hx-target="#package-form"
 								class="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"
 							>
 								${t('components.packageList.edit')}
 							</button>
							<button
								hx-delete="/packages/${p.id}"
								hx-confirm="${t('messages.confirmDelete')}"
								hx-target="closest div"
								hx-swap="delete"
								class="text-destructive hover:bg-destructive/20 px-3 py-1 rounded"
							>
								${t('components.packageList.delete')}
							</button>
 						</div>
 					</div>
 				`,
				)}
 			</div>
 		</div>
 	`
}

export function PackageForm({ package: pkg, t }: { package?: Package | null; t: TFn }) {
	const isEdit = !!pkg
	const action = isEdit ? `/packages/${pkg.id}` : '/packages'
	return html`
 		<div class="bg-background p-6 rounded-lg shadow-md mb-6">
 			<h3 class="text-xl font-bold mb-4">
 				${isEdit ? t('components.packageForm.editTitle') : t('components.packageForm.addTitle')}
 			</h3>
 			<form hx-post="${action}" hx-target="body" hx-swap="none" class="space-y-4">
 				<div>
 					<label class="block text-sm font-medium text-muted-foreground">${t('components.packageForm.name')}:</label>
 					<input
 						type="text"
 						name="name"
 						value="${pkg?.name || ''}"
 						required
 						class="mt-1 block w-full p-2 border rounded"
 					/>
 				</div>
 				<div>
 					<label class="block text-sm font-medium text-muted-foreground">
 						${t('components.packageForm.description')}:
 					</label>
 					<textarea name="description" required class="mt-1 block w-full p-2 border rounded field-sizing-content">
 						${pkg?.description || ''}
 					</textarea>
 				</div>
 				<div>
 					<label class="block text-sm font-medium text-muted-foreground">
 						${t('components.packageForm.price')}:
 					</label>
 					<input
 						type="number"
 						step="0.01"
 						name="price"
 						value="${pkg?.price || ''}"
 						required
 						class="mt-1 block w-full p-2 border rounded"
 					/>
 				</div>
 				<div class="flex space-x-2">
 					<button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">
 						${isEdit ? t('components.packageForm.update') : t('components.packageForm.create')}
 					</button>
 					<button
 						type="button"
 						hx-get="/packages"
 						hx-target="#package-form"
 						hx-swap="outerHTML"
 						class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded"
 					>
 						${t('buttons.cancel')}
 					</button>
 				</div>
 			</form>
 		</div>
 	`
}
