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

export function renderMemberRows(members: Member[], _t: TFn) {
	return members.map(
		(member) => html`
			<tr class="hover:bg-muted cursor-pointer" onclick="window.location.href='/members/${member.id}'">
				<td class="py-2 px-4 truncate">
				${member.first_name} ${member.last_name}
				</td>
				<td class="py-2 px-4">${member.email || 'N/A'}</td>
			</tr>
		`,
	)
}

export function renderLoadMoreSentinel(pagination: Pagination, search?: string, paramPrefix: string = '') {
	return html`
		<div
			hx-get="?${paramPrefix}page=${pagination.currentPage + 1}&${paramPrefix}limit=${pagination.limit}${search ? `&${paramPrefix}search=${encodeURIComponent(search)}` : ''}&append=1"
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
	paramPrefix = '',
}: {
	members: Member[]
	t: TFn
	pagination?: Pagination
	search?: string
	paramPrefix?: string
}): ComponentWithScript {
	const script = html``

	const content = html`
		<div
			id="member-list-wrapper"
			class="bg-card py-6 rounded-lg shadow-md"
		>
			<div class="h-10 px-6 flex justify-between items-center mb-4">
				<h2 class="text-2xl font-bold">${t('components.members.title')}</h2>
				<a href="/members/new" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">
					${t('buttons.addMember')}
				</a>
			</div>
			<table class="w-full border-collapse">
				<thead class="bg-background">
					<tr>
						<th class="py-2 px-4 text-left">${t('components.members.name')}</th>
						<th class="py-2 px-4 text-left">${t('components.members.email')}</th>
					</tr>
				</thead>
				<tbody id="members-table-body">
					${renderMemberRows(members, t)}
				</tbody>
			</table>
			${pagination?.hasNext ? renderLoadMoreSentinel(pagination, search, paramPrefix) : ''}
		</div>
	`

	return { content, script }
}

export function MemberCard({ member, memberPackage, t }: { member: Member; memberPackage?: Package; t: TFn }) {
	return html`
		<div class="bg-card max-w-lg w-full p-6 rounded-lg shadow-md self-start">
			<h2 class="text-2xl font-bold mb-4">${member.first_name} ${member.last_name}</h2>
			${
				member.image
					? html`<div class="my-8">
						<img src="${member.image}" alt="Member Image" class="w-full aspect-square object-cover rounded shadow-md">
					</div>`
					: ''
			}
			${
				member.signature
					? html`<div class="my-8">
						<h3 class="text-lg font-semibold mb-4">Signature</h3>
						<img src="${member.signature}" alt="Member Signature" class="border rounded shadow-md">
					</div>`
					: ''
			}
			<div class="flex flex-col md:flex-row gap-6">
				<div class="flex-1">
					<dl class="space-y-2">
						<div class="flex justify-between">
							<dt class="font-medium">${t('labels.cardId')}</dt>
							<dd>${member.card_id}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium">${t('labels.email')}</dt>
							<dd>${member.email || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium">${t('labels.phone')}</dt>
							<dd>${member.phone || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium">${t('labels.govId')}</dt>
							<dd>${member.gov_id || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium">${t('labels.package')}</dt>
							<dd>${memberPackage ? `${memberPackage.name} - ${memberPackage.price} RSD` : 'None'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium">${t('labels.expiryDate')}</dt>
							<dd>${member.expires_at || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium">${t('components.memberForm.yearOfBirth')}</dt>
							<dd>${member.year_of_birth || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium">${t('address.label')}</dt>
							<dd>${member.address_street ? `${member.address_street} ${member.address_number}, ${member.address_city}` : 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium">${t('components.memberForm.guardian')}</dt>
							<dd>${member.guardian ? `Yes - ${member.guardian_first_name} ${member.guardian_last_name} (Gov ID: ${member.guardian_gov_id})` : 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium">${t('components.memberForm.sendNotifications')}</dt>
							<dd>${member.notify ? t('enabled') : t('disabled')}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium">${t('labels.notes')}</dt>
							<dd>${member.notes || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium">${t('labels.lastUpdated')}</dt>
							<dd>${new Date(member.updated_at).toLocaleString()}</dd>
						</div>
					</dl>
					<div class="flex flex-wrap gap-2 mt-4">
						<button hx-post="/visits" hx-vals='{"card_id": "${member.card_id}"}' hx-target="#visits-list" hx-swap="outerHTML" class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">
							${t('buttons.logVisit')}
						</button>
						<!-- <a href="/members" class="text-primary hover:bg-primary/20 px-4 py-2 rounded">${t('buttons.backToMembers')}</a> -->
						<a href="/members/${member.id}/edit" class="text-primary hover:bg-primary/20 px-4 py-2 rounded">${t('buttons.editMember')}</a>
						${
							member.signature
								? html`						<a href="/members/${member.id}/consent" class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded">${t('buttons.printConsent')}</a>`
								: ''
						}
					</div>
				</div>
			</div>
		</div>
	`
}

export function MembersSection({
	members,
	t,
	pagination,
	search,
	paramPrefix = '',
}: {
	members: Member[]
	t: TFn
	pagination: Pagination
	search?: string
	paramPrefix?: string
}) {
	const searchInput = html`
		<div class="mb-6">
			<input
				type="text"
				placeholder="${t('components.members.searchPlaceholder')}"
				class="w-full p-2 border rounded"
				hx-get="?${paramPrefix}page=1&${paramPrefix}limit=${pagination.limit}"
				hx-target="#member-list-wrapper"
				hx-swap="outerHTML"
				hx-trigger="input changed delay:300ms"
				name="${paramPrefix}search"
				value="${search || ''}"
			/>
		</div>
	`

	const { content: listContent } = MemberList({ members, t, pagination, search, paramPrefix })

	return html`
		<div id="members-section" class="flex-1">
			${searchInput}
			${listContent}
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
		<div class="bg-card p-6 rounded-xl shadow my-6 max-w-xl mx-auto">
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
						${t('components.memberForm.yearOfBirth')}:
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
								<div class="w-full aspect-square bg-muted border rounded overflow-hidden">
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
								<div class="w-full aspect-square bg-muted border rounded overflow-hidden">
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
								<div class="w-full aspect-square bg-muted border rounded overflow-hidden">
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
					<a
						href="${isEdit ? `/members/${member.id}` : '/members'}"
						class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded inline-block"
					>
						${t('buttons.cancel')}
					</a>
					<span class="flex-auto"></span>
					${
						isEdit
							? html`
								<button
									type="button"
									hx-delete="/members/${member.id}"
									hx-confirm="${t('messages.confirmDelete')}"
									class="bg-destructive text-destructive-foreground hover:bg-destructive/80 px-4 py-2 rounded"
								>
									${t('delete')}
								</button>
								`
							: ''
					}
 				</div>
			</form>
		</div>
	`

	return { content, script }
}
