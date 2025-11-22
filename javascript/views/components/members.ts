import { html } from 'hono/html'
import type { JSXNode } from 'hono/jsx'
import type { TFn } from '../../middleware/i18n'
import type { Member, Package } from '../../types'

interface ComponentWithScript {
	content: ReturnType<typeof html> | JSXNode
	script?: ReturnType<typeof html>
}

interface Pagination {
	currentPage: number
	totalPages: number
	limit: number
	totalItems: number
	hasNext: boolean
	hasPrev: boolean
}

function _renderPagination(pagination: Pagination, search?: string) {
	const { currentPage, totalPages, hasNext, hasPrev } = pagination

	if (totalPages <= 1) return ''

	const pages = []
	const startPage = Math.max(1, currentPage - 2)
	const endPage = Math.min(totalPages, currentPage + 2)

	for (let i = startPage; i <= endPage; i++) {
		pages.push(i)
	}

	return html`
		<div class="flex items-center justify-between mt-4">
			<div class="text-sm text-muted-foreground">
				Showing ${pagination.totalItems} members
			</div>
			<div class="flex items-center space-x-2">
				${
					hasPrev
						? html`
					<a href="?page=${currentPage - 1}&limit=${pagination.limit}${search ? `&search=${encodeURIComponent(search)}` : ''}"
					   hx-get="?page=${currentPage - 1}&limit=${pagination.limit}${search ? `&search=${encodeURIComponent(search)}` : ''}"
					   hx-target="#member-list-wrapper"
					   hx-swap="outerHTML"
					   class="px-3 py-1 text-sm border rounded hover:bg-muted">
						Previous
					</a>
				`
						: ''
				}
				${pages.map(
					(page) => html`
					<a href="?page=${page}&limit=${pagination.limit}${search ? `&search=${encodeURIComponent(search)}` : ''}"
					   hx-get="?page=${page}&limit=${pagination.limit}${search ? `&search=${encodeURIComponent(search)}` : ''}"
					   hx-target="#member-list-wrapper"
					   hx-swap="outerHTML"
					   class="px-3 py-1 text-sm border rounded hover:bg-muted ${page === currentPage ? 'bg-primary text-primary-foreground' : ''}">
						${page}
					</a>
				`,
				)}
				${
					hasNext
						? html`
					<a href="?page=${currentPage + 1}&limit=${pagination.limit}${search ? `&search=${encodeURIComponent(search)}` : ''}"
					   hx-get="?page=${currentPage + 1}&limit=${pagination.limit}${search ? `&search=${encodeURIComponent(search)}` : ''}"
					   hx-target="#member-list-wrapper"
					   hx-swap="outerHTML"
					   class="px-3 py-1 text-sm border rounded hover:bg-muted">
						Next
					</a>
				`
						: ''
				}
				${
					hasNext
						? html`
					<button hx-get="?page=${currentPage + 1}&limit=${pagination.limit}${search ? `&search=${encodeURIComponent(search)}` : ''}&append=1"
					   hx-target="#members-table-body"
					   hx-swap="beforeend"
					   class="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/80 ml-4">
						Load More
					</button>
				`
						: ''
				}
			</div>
		</div>
	`
}

interface Pagination {
	currentPage: number
	totalPages: number
	limit: number
	totalItems: number
	hasNext: boolean
	hasPrev: boolean
}

export function renderMemberRows(members: Member[], t: TFn) {
	return members.map(
		(member) => html`
		<tr class="border-b hover:bg-muted">
			<td class="py-2 px-4 truncate">
				<a
					href="/members/${member.id}"
					class="text-primary hover:underline"
				>
					${member.first_name} ${member.last_name}
				</a>
			</td>
			<td class="py-2 px-4">${member.email || 'N/A'}</td>
			<td class="py-2 px-4 space-x-2">
				<a
					href="/members/${member.id}"
					class="px-1 py-0.5 bg-primary text-primary-foreground hover:bg-primary/80 rounded"
				>
					${t('buttons.view')}
				</a>
				<a
					href="/members/${member.id}/edit"
					class="px-1 py-0.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded"
				>
					${t('buttons.edit')}
				</a>
			<button
				hx-delete="/members/${member.id}"
				hx-confirm="${t('messages.confirmDelete')}"
				hx-target="#member-list-wrapper"
				hx-swap="outerHTML"
				class="px-1 py-0.5 text-destructive hover:bg-destructive/20 rounded border-none inline-flex items-center h-5"
			>
					${t('buttons.delete')}
				</button>
			</td>
		</tr>
	`,
	)
}

export function renderLoadMoreSentinel(pagination: Pagination, search?: string) {
	return html`
		<div
			hx-get="?page=${pagination.currentPage + 1}&limit=${pagination.limit}${search ? `&search=${encodeURIComponent(search)}` : ''}&append=1"
			hx-trigger="revealed"
			hx-target="#members-table-body"
			hx-swap="beforeend"
			style="visibility: hidden;"
		></div>
	`
}

export function MemberList({
	members,
	t,
	pagination,
	search,
}: {
	members: Member[]
	t: TFn
	pagination?: Pagination
	search?: string
}): ComponentWithScript {
	const script = html``

	const content = html`
		<div
			id="member-list-wrapper"
			class="bg-background p-6 rounded-lg shadow-md"
		>
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-2xl font-bold">${t('components.members.title')}</h2>
				<a href="/members/new" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">
					${t('buttons.addMember')}
				</a>
			</div>
			<table class="w-full border-collapse border">
				<thead>
					<tr class="bg-card">
						<th class="py-2 px-4 text-left">${t('components.members.name')}</th>
						<th class="py-2 px-4 text-left">${t('components.members.email')}</th>
						<th class="py-2 px-4 text-left">${t('components.members.actions')}</th>
					</tr>
				</thead>
				<tbody id="members-table-body">
					${renderMemberRows(members, t)}
				</tbody>
			</table>
			${pagination?.hasNext ? renderLoadMoreSentinel(pagination, search) : ''}
		</div>
	`

	return { content, script }
}

export function MemberCard({ member, t }: { member: Member; t: TFn }) {
	return html`
		<div class="member-card">
			<h3>
				${member.first_name} ${member.last_name}
			</h3>
			<p>
				${t('components.memberCard.cardId')}:${member.card_id}
			</p>
			<p>
				${t('components.memberCard.lastUpdated')}:${member.updated_at}
			</p>
		</div>
	`
}

export function MemberForm({
	packages,
	member,
	t,
}: {
	packages: Package[]
	member?: Member | null
	t: TFn
}): ComponentWithScript {
	const isEdit = !!member
	const action = isEdit ? `/members/${member.id}` : '/members'
	const initialGuardian = !!member?.guardian

	const script = html`
		<script>
			document.addEventListener('alpine:init', () => {
			Alpine.data('cameraCapture', () => ({
				stream: null,
				displayMode: 'existing', // 'existing', 'camera', 'captured'
				originalImage: '',
				init() {
					console.log('Camera component initialized')
					this.originalImage = document.getElementById('image-input').value
				},
				async startCamera() {
					if (this.displayMode === 'camera') return
					this.displayMode = 'camera'
					this.$nextTick(async () => {
						const video = document.getElementById('video')
						if (!video) {
							console.error('Video element not found')
							this.displayMode = 'existing'
							return
						}
						if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
							try {
								this.stream = await navigator.mediaDevices.getUserMedia({ video: true })
								video.srcObject = this.stream
								video.play()
							} catch (err) {
								console.error("Error accessing camera: ", err)
								alert('Could not access the camera. Please ensure you have given permission.')
								this.displayMode = 'existing'
							}
						}
					})
				},
				captureImage() {
					if (this.displayMode !== 'camera') return
					const video = document.getElementById('video')
					if (!video) {
						console.error('Video element not found for capture')
						return
					}
					const canvas = document.getElementById('canvas')
					const capturedImage = document.getElementById('captured-image')
					const imageInput = document.getElementById('image-input')

					// Set canvas dimensions to match video
					canvas.width = video.videoWidth
					canvas.height = video.videoHeight

					// Draw the current video frame to the canvas
					const context = canvas.getContext('2d')
					context.drawImage(video, 0, 0, canvas.width, canvas.height)

					// Get the image data from the canvas as a base64 string
					const dataUrl = canvas.toDataURL('image/png')

					// Show the captured image and set the hidden input value
					if (imageInput) imageInput.value = dataUrl
					this.displayMode = 'captured'
					this.$nextTick(() => {
						const capturedImg = document.getElementById('captured-image')
						if (capturedImg) capturedImg.src = dataUrl
					})
					this.stopCamera()
				},
				killCamera() {
					this.stopCamera()
					this.displayMode = 'existing'
				},
				stopCamera() {
					if (this.stream) {
						this.stream.getTracks().forEach(track => track.stop())
						const video = document.getElementById('video')
						if (video) {
							video.srcObject = null
						}
						this.stream = null
					}
				},
				keepImage() {
					// Update originalImage to the new captured image so it displays in existing mode
					this.originalImage = document.getElementById('image-input').value
					this.displayMode = 'existing'
				},
				revertImage() {
					this.$nextTick(() => {
						const imageInput = document.getElementById('image-input')
						const capturedImage = document.getElementById('captured-image')
						if (imageInput) imageInput.value = this.originalImage
						if (capturedImage) capturedImage.src = this.originalImage
						this.displayMode = 'existing'
					})
				}
			}))
			Alpine.data('formHelper', (initialGuardian) => ({
				setExpiryDate(months) {
					const date = new Date()
					date.setMonth(date.getMonth() + months)
					const input = document.getElementById('expiry-date')
					if (input) {
						input.value = date.toISOString().split('T')[0]
					}
				},
				isGuardian: initialGuardian
			}))
		})
		</script>
	`

	const content = html`
		<div class="bg-background p-6 rounded-lg shadow-md mb-6">
			<h3 class="text-xl font-bold mb-4">
				${isEdit ? t('components.memberForm.editTitle') : t('components.memberForm.addTitle')}
			</h3>
			<form
				hx-post="${action}"
				hx-target="body"
				hx-swap="none"
				class="space-y-4"
				x-data="formHelper(${initialGuardian})"
			>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">
						${t('components.memberForm.firstName')}:
					</label>
					<input
						type="text"
						name="first_name"
						value="${member?.first_name || ''}"
						required
						class="mt-1 block w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">
						${t('components.memberForm.lastName')}:
					</label>
					<input
						type="text"
						name="last_name"
						value="${member?.last_name || ''}"
						required
						class="mt-1 block w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.email')}:</label>
					<input
						type="email"
						name="email"
						value="${member?.email || ''}"
						class="mt-1 block w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.phone')}:</label>
					<input type="tel" name="phone" value="${member?.phone || ''}" class="mt-1 block w-full p-2 border rounded" />
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">
						${t('components.memberForm.cardId')}:
					</label>
					<input
						type="text"
						name="card_id"
						value="${member?.card_id || ''}"
						required
						class="mt-1 block w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.govId')}:</label>
					<input
						type="text"
						name="gov_id"
						value="${member?.gov_id || ''}"
						class="mt-1 block w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">
						${t('components.memberForm.year_of_birth')}:
					</label>
					<input
						type="text"
						name="year_of_birth"
						value="${member?.year_of_birth || ''}"
						class="mt-1 block w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">
						${t('components.memberForm.package')}:
					</label>
					<select
						name="package_id"
						class="mt-1 block w-full p-2 border rounded h-10"
					>
						<option value="">None</option>
						${packages.map(
							(p) => html`
							<option value="${p.id}" ${member?.package_id === p.id ? 'selected' : ''}>
								${p.name} - ${p.price}
								RSD
							</option>
						`,
						)}
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">
						${t('components.memberForm.expiryDate')}:
					</label>
					<div class="flex space-x-2 mb-2">
						<button
							type="button"
							x-on:click="setExpiryDate(1)"
							class="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"
						>
							${t('components.memberForm.expiry1Month')}
						</button>
						<button
							type="button"
							x-on:click="setExpiryDate(6)"
							class="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"
						>
							${t('components.memberForm.expiry6Months')}
						</button>
						<button
							type="button"
							x-on:click="setExpiryDate(12)"
							class="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"
						>
							${t('components.memberForm.expiry1Year')}
						</button>
					</div>
					<input
						type="date"
						name="expires_at"
						id="expiry-date"
						value="${member?.expires_at || ''}"
						class="mt-1 block w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">${t('image')}:</label>
					<input type="hidden" name="image" id="image-input" value="${member?.image || ''}" />
					<div x-data="cameraCapture()">
						<template x-if="displayMode === 'existing'">
							<div class="space-y-2">
								<div class="max-w-80 w-full aspect-square bg-muted border rounded overflow-hidden">
									<template x-if="originalImage">
										<img
											x-bind:src="originalImage || '/placeholder-image.png'"
											alt="Current member image"
											class="size-full object-cover"
										/>
									</template>
								</div>
								<div class="flex space-x-2">
									<button
										type="button"
										x-on:click="startCamera()"
										class="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"
									>
										${t('components.memberForm.cameraStart')}
									</button>
								</div>
							</div>
						</template>
						<template x-if="displayMode === 'camera'">
							<div class="space-y-2">
								<div class="max-w-80 w-full aspect-square bg-muted border rounded overflow-hidden">
									<video id="video" class="size-full object-cover" autoplay muted></video>
								</div>
								<div class="flex space-x-2">
									<button
										type="button"
										x-on:click="captureImage()"
										class="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/80"
									>
										${t('components.memberForm.cameraCapture')}
									</button>
									<button
										type="button"
										x-on:click="killCamera()"
										class="text-destructive hover:bg-destructive/20 px-3 py-1 rounded"
									>
										${t('components.memberForm.cameraStop')}
									</button>
								</div>
							</div>
						</template>
						<template x-if="displayMode === 'captured'">
							<div class="space-y-2">
								<div class="max-w-80 w-full aspect-square bg-muted border rounded overflow-hidden">
									<img id="captured-image" class="size-full object-cover" />
								</div>
								<div class="flex space-x-2">
									<button
										type="button"
										x-on:click="keepImage()"
										class="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/80"
									>
										${t('components.memberForm.cameraKeep')}
									</button>
									<button
										type="button"
										x-on:click="revertImage()"
										class="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"
									>
										${t('components.memberForm.cameraRevert')}
									</button>
								</div>
							</div>
						</template>
						<canvas id="canvas" class="hidden"></canvas>
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">${t('labels.notes')}:</label>
					<textarea name="notes" class="mt-1 block w-full p-2 border rounded field-sizing-content">
						${member?.notes || ''}
					</textarea>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">${t('address.street')}</label>
					<input
						type="text"
						name="address_street"
						value="${member?.address_street || ''}"
						class="mt-1 block w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">${t('address.number')}</label>
					<input
						type="text"
						name="address_number"
						value="${member?.address_number || ''}"
						class="mt-1 block w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">${t('address.city')}</label>
					<input
						type="text"
						name="address_city"
						value="${member?.address_city || ''}"
						class="mt-1 block w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">
						<input type="checkbox" name="guardian" x-model="isGuardian" class="mr-2" />
						${t('components.memberForm.hasGuardian')}
					</label>
				</div>
				<div x-show="isGuardian">
					<div>
						<label class="block text-sm font-medium text-muted-foreground">
							${t('components.memberForm.guardianFirstName')}:
						</label>
						<input
							type="text"
							name="guardian_first_name"
							value="${member?.guardian_first_name || ''}"
							class="mt-1 block w-full p-2 border rounded"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-muted-foreground">
							${t('components.memberForm.guardianLastName')}:
						</label>
						<input
							type="text"
							name="guardian_last_name"
							value="${member?.guardian_last_name || ''}"
							class="mt-1 block w-full p-2 border rounded"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-muted-foreground">
							${t('components.memberForm.guardianGovId')}:
						</label>
						<input
							type="text"
							name="guardian_gov_id"
							value="${member?.guardian_gov_id || ''}"
							class="mt-1 block w-full p-2 border rounded"
						/>
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground">
						<input type="checkbox" name="notify" ${member?.notify === 1 ? 'checked' : ''} class="mr-2" />
						${t('components.memberForm.sendNotifications')}
					</label>
				</div>
				<div class="flex space-x-2">
					<button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">
						${isEdit ? t('components.memberForm.update') : t('components.memberForm.create')}
					</button>
					<button
						type="button"
						hx-get="${isEdit ? `/members/${member.id}` : '/members'}"
						hx-target="#member-form"
						class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded"
					>
						${t('buttons.cancel')}
					</button>
				</div>
			</form>
		</div>
	`

	return { content, script }
}
