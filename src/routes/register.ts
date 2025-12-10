import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { customLocaleDetector, type TFn } from '../middleware/i18n'
import * as q from '../queries'
import type { Package } from '../types'
import { PageLayout } from '../views/layouts'

const registerRouter = new Hono()

function renderRegisterForm(t: TFn, packages: Package[], errors: string[] = []) {
	const signatureScript = html`
		<script src="/public/signature_pad.js"></script>
		<script>
			document.addEventListener('alpine:init', () => {
				Alpine.data('signaturePad', () => ({
					signaturePad: null,
					member: {
						is_guardian: false,
						first_name: '',
						last_name: '',
						email: '',
						phone: '',
						gov_id: '',
						year_of_birth: '',
						address_street: '',
						address_number: '',
						address_city: '',
						guardian_first_name: '',
						guardian_last_name: '',
						guardian_gov_id: ''
					},
					init() {
						const canvas = document.getElementById('signature-pad');
						if (canvas) {
							canvas.style.backgroundColor = 'white';
							this.signaturePad = new SignaturePad(canvas, {
								penColor: 'black'
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
							const data = this.signaturePad.toData();
							const canvas = document.getElementById('signature-pad');
							const tempCanvas = document.createElement('canvas');
							tempCanvas.width = canvas.width;
							tempCanvas.height = canvas.height;
							const tempCtx = tempCanvas.getContext('2d');
							tempCtx.fillStyle = 'white';
							tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
							const tempPad = new SignaturePad(tempCanvas, { penColor: 'black' });
							tempPad.fromData(data);
							const dataUrl = tempPad.toDataURL();
							document.getElementById('signature-input').value = dataUrl;
						}
					}
				}));
				Alpine.data('cameraCapture', () => ({
					stream: null,
					displayMode: 'existing', // 'existing', 'camera', 'captured'
					originalImage: '',
					cameras: [],
					currentCameraIndex: 0,
					init() {
						console.log('Camera component initialized')
						this.originalImage = document.getElementById('image-input').value
					},
				async startCamera() {
					console.log('startCamera called')
					if (this.displayMode === 'camera') return
					this.displayMode = 'camera'
					this.$nextTick(async () => {
						const video = document.getElementById('video')
						if (!video) {
							console.error('Video element not found')
							this.displayMode = 'existing'
							return
						}
						console.log('Requesting camera access')
						if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
							try {
								this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
								if (navigator.mediaDevices.enumerateDevices) {
									const devices = await navigator.mediaDevices.enumerateDevices()
									this.cameras = devices.filter(device => device.kind === 'videoinput')
								}
								console.log('Camera access granted')
								video.srcObject = this.stream
								await video.play()
								console.log('Video playing')
							} catch (err) {
								console.error("Error accessing camera: ", err)
								alert('Could not access the camera. Please ensure you have given permission.')
								this.displayMode = 'existing'
							}
						} else {
							console.error("getUserMedia not supported")
							alert('Camera not supported on this device.')
							this.displayMode = 'existing'
						}
					})
				},
					async switchCamera() {
						if (this.cameras.length < 2) return
						if (this.stream) {
							this.stream.getTracks().forEach(track => track.stop())
						}
						this.currentCameraIndex = (this.currentCameraIndex + 1) % this.cameras.length
						const deviceId = this.cameras[this.currentCameraIndex].deviceId
						try {
							this.stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } })
							const video = document.getElementById('video')
							if (video) {
								video.srcObject = this.stream
								await video.play()
							}
						} catch (err) {
							console.error("Error switching camera:", err)
						}
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
				}));
			});
		</script>
	`

	const errorHtml =
		errors.length > 0
			? html`<div class="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4" style="white-space: pre-line;">${errors.join('\n')}</div>`
			: ''

	const content = html`
		<div id="register-container">
			<div class="p-4 w-full">
				<div class="bg-background p-6 rounded-lg shadow-md mb-6 max-w-2xl mx-auto">
					<h3 class="text-xl font-bold mb-4">${t('register.title')}</h3>
					${errorHtml}
					<form
						hx-post="/register"
						hx-target="#register-container"
						hx-swap="innerHTML"
						class="space-y-4"
						x-data="signaturePad()"
						x-on:submit="setSignatureData"
					>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.firstName')}:</label>
								<input type="text" name="first_name" x-model="member.first_name" required class="mt-1 block w-full p-2 border rounded" />
							</div>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.lastName')}:</label>
								<input type="text" name="last_name" x-model="member.last_name" required class="mt-1 block w-full p-2 border rounded" />
							</div>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.email')}:</label>
								<input type="email" name="email" x-model="member.email" class="mt-1 block w-full p-2 border rounded" />
							</div>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.phone')}:</label>
								<input type="tel" name="phone" x-model="member.phone" class="mt-1 block w-full p-2 border rounded" />
							</div>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.cardId')}:</label>
								<input type="text" name="card_id" required class="mt-1 block w-full p-2 border rounded" />
							</div>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.govId')}:</label>
								<input type="text" name="gov_id" x-model="member.gov_id" class="mt-1 block w-full p-2 border rounded" />
							</div>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.yearOfBirth')}:</label>
								<input type="number" name="year_of_birth" x-model.number="member.year_of_birth" required class="mt-1 block w-full p-2 border rounded" />
							</div>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.package')}:</label>
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
						<div>
							<label class="block text-sm font-medium text-muted-foreground">${t('image')}:</label>
							<input type="hidden" name="image" id="image-input" value="" />
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
										<video id="video" class="size-full object-cover" autoplay muted playsinline></video>
									</div>
										<div class="flex space-x-2">
											<button
												type="button"
												x-show="cameras.length > 1"
												x-on:click="switchCamera()"
												class="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"
											>
												${t('components.memberForm.cameraSwitch')}
											</button>
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
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label class="block text-sm font-medium text-muted-foreground">${t('address.street')}:</label>
								<input type="text" name="address_street" x-model="member.address_street" class="mt-1 block w-full p-2 border rounded" />
							</div>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">${t('address.number')}:</label>
								<input type="text" name="address_number" x-model="member.address_number" class="mt-1 block w-full p-2 border rounded" />
							</div>
							<div>
								<label class="block text-sm font-medium text-muted-foreground">${t('address.city')}:</label>
								<input type="text" name="address_city" x-model="member.address_city" class="mt-1 block w-full p-2 border rounded" />
							</div>
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">
								<input type="checkbox" name="guardian" class="mr-2" x-model="member.is_guardian" />
								${t('components.memberForm.isGuardian')}
							</label>
							<div
								x-show="member.is_guardian"
								class="border-l-2 border-primary pl-4 mt-2 space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4"
							>
								<div>
									<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.guardianFirstName')}:</label>
									<input type="text" name="guardian_first_name" x-model="member.guardian_first_name" class="mt-1 block w-full p-2 border rounded" />
								</div>
								<div>
									<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.guardianLastName')}:</label>
									<input type="text" name="guardian_last_name" x-model="member.guardian_last_name" class="mt-1 block w-full p-2 border rounded" />
								</div>
								<div>
									<label class="block text-sm font-medium text-muted-foreground">${t('components.memberForm.guardianGovId')}:</label>
									<input type="text" name="guardian_gov_id" x-model="member.guardian_gov_id" class="mt-1 block w-full p-2 border rounded" />
								</div>
							</div>
						</div>
						<div class="w-full prose prose-sm dark:prose-invert max-w-3xl space-y-6 select-text">
							<div>
								<h2 class="text-lg font-semibold mb-4">
									Izjava odgovornosti
								</h2>
								<ol class="list-decimal space-y-2 pl-6">
									<li>Da sam razumeo da je aktivnost sportsko penjanje i planinarenje ekstreman sport, te da postoji opasnost od povreda i nesrećnih slučajeva koju bilo kakva količina brige, opreza, nastave ili ekspertize može potpuno eliminisati. Ja izričito i dobrovoljno preuzimam sav rizik od povreda ili smrti ukoliko se dese dok učestvujem u aktivnostima sportskog penjanja i planinarenja u klubu i sa klubom van kluba.</li>
									<li>Na poleđini "izjave odgovornosti" nalazi se izjava o pristanku - saglasnosti za obradu podataka o ličnosti.</li>
									<li>Obavezujem se da ću opremu koju budem koristio/la u ovim prostorijama, koristiti na bezbedan način, u skladu sa uputstvom koje sam dobio/la od instruktora kluba o korišćenju opreme, kako ne bih ugrozio/la živote ljudi i imovine bilo kog pojedinca. A ukoliko koristim svoju opremu (uže za penjenje, sigurnosni pojas, sprave za osiguravanje sebe i partnera), obavezujem se da ću je koristiti na bezbedan način kako ne bih ugrozio/la živote ljudi i imovine pojedinca, kao i da preuzimam spostveni rizik za korišćenje sopstvene opreme.</li>
									<li>Da nisam pod uticajem droge, alkohola ili drugih psihoaktivnih supstanci koje bi mogle da utiču na pravilno rasuđivanje pri sportskom penjanju i planinarenju.</li>
									<li>Da sam u dobrom zdravstvenom stanju i da kod mene ne postoji ni jedna zdravstvena smetnja koja bi mogla uticati na bavljenje aktivnostima sportskog penjanja i planinarenja.</li>
									<li>Da sam blagovremeno upoznat/a sa svim opasnostima i rizicima koje mogu da nastanu prilikom aktivnosti sportskog penjanja i planinarenja u Klubu i sa klubom.</li>
									<li>Da sam blagovremeno upozoren/a da lične stvari koje ostavim u svlačionici kluba ili bilo gde van sopostvenog nadzora, to činim na sopstvenu odgovornost.</li>
									<li>Da mi je Klub preporučio da se osiguram kod osiguravajućeg društva od posledica nesrećnog slučaja.</li>
									<li>Da sam dobio/la punu priliku da postavim Klubu bilo koje pitanje u vezi sa aktivnostima sportskog penjanja, kao i planinarenja i dobio odgovor, što i potvrđujem potpisivanjem ove "izjave odgovornosti".</li>
									<li>Da sam saglasan/na da sam dobio/la adekvatnu priliku da pročitam i razumem tekst ove "izjave odgovornosti", te da ista nije predočena u poslednjem trenutku.</li>
									<li>Potvrđujem da sam punoletan/na.</li>
									<li x-show="member.is_guardian">
										Potvrđujem da sam saglasan/na kao roditelj ili zakonski staratelj da moje dete
										({{ member.first_name }} {{ member.last_name }}, JMBG: {{ member.gov_id }}),
										pristupi klubu i da dobrovoljno preuzimam svu odgovornost i sav rizik koji može nastati meni ili mom
										maloletnom detetu kao rezultat bilo kakve povrede u Klubu i sa klubom van prostorija kluba.
									</li>
									<li>Da sam pročitao/la ovu "IZJAVU ODGOVORNOSTI" i da sam u potpunosti razumeo/la njegov sadržaj i pravne posledice, te da pristajem na sve rizike i posledice predočene u ovoj "izjavi odgovornosti"i svojom ozbiljnom i slobodnom voljom istu potpisujem kao znak prihvatanja iste.</li>
									<li>Na oglasnoj tabli kluba se nalazi kućni red kluba, koji sam pročitao/la i upoznao sa pravilima ponašanja tokom boravka u prostorijama kluba.</li>
								</ol>
							</div>
							<div>
								<h2 class="text-lg font-semibold mb-4">
									Izjava o pristanku/saglasnosti na obradu podataka o ličnosti
								</h2>
								<p class="mb-4">
									Član, kao lice na koje se podaci odnose, slobodno i bez ikakve prinude i uslovljavanja daje svoj pristanak Penjačkom klubu Adrenalin sa sedištem u Milete Protića broj 12, PIB 101662166, e-mail office@adrenalin.org.rs, broj telefona 00381631785588 (u daljem tekstu Rukovaoc) da obrađuje moje lične podatke i to:
								</p>
								<ul class="list-disc pl-6 mb-4">
									<li>Ime i prezime</li>
									<li>JMBG</li>
									<li>Ulicu i broj</li>
									<li>Mesto/grad</li>
									<li x-show="member.is_guardian">
										Ime, prezime i JMBG maloletnog lica čiji je staratelj potpisao "izjavu odgovornosti"
									</li>
									<li>Svaki drugi podatak o ličnosti koji sam svojevoljno dao rukovaocu (osim posebnih vrsta podataka o ličnosti u skladu sa Zakonom)</li>
								</ul>
								<p class="mb-2">
									Navedeni podaci mogu se upotrebljavati isključivo u svrhu arhiviranja i skladištenja podataka članova kluba i u druge svrhe se ne mogu koristiti.
								</p>
								<p>
									Upoznat sam da imam pravo na opoziv pristanka za obradu podataka o ličnosti i dejstva i pravnih posledica takvog opoziva u skladu sa Zakonom, kao i da opoziv pristanka ne utiče na dopuštenost obrade koja je vršena na osnovu pristanka pre opoziva.
								</p>
							</div>
						</div>
						<div>
							<label class="block text-sm font-medium text-muted-foreground">${t('register.signature')}:</label>
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
								${t('buttons.register')}
							</button>
						</div>
					</form>
					${errorHtml}
				</div>
			</div>
		</div>
	`

	return { content, script: signatureScript }
}

registerRouter.get('/register', async (c) => {
	const t = await useTranslation(c)
	const locale = customLocaleDetector(c)
	const packages = await q.getPackages()

	const { content, script } = renderRegisterForm(t, packages)

	return c.html(PageLayout({ title: 'Register', content, script, hideNav: true, t, locale }))
})

registerRouter.post('/register', async (c) => {
	const t = await useTranslation(c)
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
		signature: (body.signature as string) || undefined,
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

	const errors: string[] = []

	if (await q.cardIdExists(member.card_id)) {
		errors.push(t('register.errors.cardIdExists'))
	}

	if (member.gov_id && (await q.govIdExists(member.gov_id))) {
		errors.push(t('register.errors.govIdExists'))
	}

	if (errors.length > 0) {
		const packages = await q.getPackages()
		const { content } = renderRegisterForm(t, packages, errors)
		return c.html(content)
	}

	await q.addMember(member)
	c.header('HX-Redirect', '/register')
	return c.text('', 200)
})

export default registerRouter
