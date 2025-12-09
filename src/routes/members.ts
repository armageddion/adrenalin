import { useTranslation } from '@intlify/hono'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { customLocaleDetector } from '../middleware/i18n'
import * as q from '../queries'
import type { Member } from '../types'
import { MemberForm, MemberList, VisitList } from '../views/components'
import { MemberCard, renderMemberRows } from '../views/components/members'
import { PageLayout } from '../views/layouts'
import { notFoundResponse } from './utils'

export function parseMemberData(
	body: Record<string, unknown>,
	_isUpdate = false,
): Omit<Member, 'id' | 'created_at' | 'updated_at'> {
	const member = {
		first_name: body.first_name as string,
		last_name: body.last_name as string,
		email: (body.email as string) || undefined,
		phone: (body.phone as string) || undefined,
		card_id: body.card_id as string,
		gov_id: (body.gov_id as string) || undefined,
		package_id: body.package_id
			? (() => {
				const p = Number.parseInt(body.package_id as string, 10)
				return Number.isNaN(p) ? undefined : p
			})()
			: undefined,
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
		year_of_birth: (() => {
			const y = Number.parseInt(body.year_of_birth as string, 10)
			return Number.isNaN(y) ? undefined : y
		})(),
	}
	return member
}

const membersRouter = new Hono()

membersRouter.get('/', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)

	const page = Number.parseInt(c.req.query('page') || '1', 10)
	const limit = Number.parseInt(c.req.query('limit') || '100', 10)
	const search = c.req.query('search') || ''
	const append = c.req.query('append') === '1'

	const members = search
		? await q.searchMembersPaginated(search, page, limit)
		: await q.getMembersPaginated(page, limit)
	const totalMembers = search ? await q.searchMembersCount(search) : await q.getMembersCount()

	const pagination = {
		currentPage: page,
		totalPages: Math.ceil(totalMembers / limit),
		limit,
		totalItems: totalMembers,
		hasNext: page < Math.ceil(totalMembers / limit),
		hasPrev: page > 1,
	}

	// If append mode, return only the table rows and next sentinel
	if (append) {
		return c.html(html`${renderMemberRows(members, t)}`)
	}

	const { content: _content, script } = MemberList({ members, t, pagination, search })

	const searchInput = html`
		<div class="p-6">
			<input
				type="text"
				placeholder="${t('components.members.searchPlaceholder')}"
				class="w-full p-2 border rounded"
				hx-get="?page=1&limit=${pagination.limit}"
				hx-target="#member-list-wrapper"
				hx-swap="outerHTML"
				hx-trigger="input changed delay:300ms"
				name="search"
				value="${search || ''}"
			/>
		</div>
	`

	const content = html`
		<div id="member-form"></div>
		${c.req.header('HX-Request') ? '' : searchInput}
		<div id="member-list-wrapper">
			${_content}
		</div>
	`

	if (c.req.header('HX-Request')) {
		return c.html(content)
	}
	return c.html(
		PageLayout({
			title: t('components.members.title'),
			content,
			script,
			locale,
			t,
		}),
	)
})

membersRouter.get('/new', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const packages = await q.getPackages()
	const { content, script } = MemberForm({ packages, member: null, t })
	return c.html(
		PageLayout({
			title: t('components.memberForm.addTitle'),
			content,
			script,
			locale,
			t,
		}),
	)
})

membersRouter.get('/:id', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	const member = await q.getMember(id)
	if (member) {
		const visits = await q.getVisitsByMemberId(id)
		const packages = await q.getPackages()
		const memberPackage = packages.find((p) => p.id === member.package_id)
		const memberContent = html`
			<div class="flex max-w-6xl w-full mx-auto my-6 gap-6">
				${MemberCard({ member, memberPackage, t })}
				${VisitList({ visits, t }).content}
			</div>
		`
		if (c.req.header('HX-Request')) {
			return c.html(memberContent)
		}
		return c.html(
			PageLayout({
				title: `${member.first_name} ${member.last_name}`,
				content: memberContent,
				locale,
				t,
			}),
		)
	}
	return notFoundResponse(c, t, 'member')
})

membersRouter.get('/:id/edit', async (c) => {
	const t = useTranslation(c)
	const locale = customLocaleDetector(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	const member = await q.getMember(id)
	const packages = await q.getPackages()

	if (member) {
		const { content: _content, script } = MemberForm({ packages, member, t })

		const content = html`
			<div id="member-form">
				${_content}
			</div>
		`
		if (c.req.header('HX-Request')) {
			return c.html(content)
		}

		return c.html(
			PageLayout({
				title: t('components.memberForm.editTitle'),
				content,
				script,
				locale,
				t,
			}),
		)
	}
	return notFoundResponse(c, t, 'member')
})

membersRouter.get('/:id/consent', async (c) => {
	const t = useTranslation(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	const member = await q.getMember(id)
	if (member?.signature) {
		const logoSrc = '/public/assets/adrenalin_logo.jpg'
		const content = html`
			<div class="p-4 w-full max-w-4xl mx-auto">
				<div class="bg-background p-6 rounded-lg shadow-md">
					<div class="club-name" style="text-align: center; margin-bottom: 20px;">
						<h1 style="text-align: center; margin: 50px;">PENJAČKI KLUB ADRENALIN NOVI SAD</h1>
					</div>
					<div class="header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
						<div class="logo" style="width: 350px; height: auto; margin-right: 20px;">
							<img src="${logoSrc}" width="350" />
						</div>
						<div class="club-details" style="text-align: right; margin-right: 50px">							
							<p>
								MILETE PROTIĆA 12, 21000 NOVI SAD<br/>
								Telefon: +381.63.178.55.88<br/>
								Website: WWW.ADRENALIN.ORG.RS<br/>
								Email: OFFICE@ADRENALIN.ORG.RS<br/>
								PIB: 101662166<br/>
								MATIČNI BROJ: 08715181<br/>
								BROJ ŽIRO RAČUNA: 160-547671-49<br/>
							</p>
						</div>
					</div>
					<div class="declaration" style="margin-bottom: 20px; margin-right: 100px; margin-left:100px;">
						<h2>Izjava odgovornosti</h2>
						<p>Ja ${member.guardian ? member.guardian_first_name : member.first_name} ${member.guardian ? member.guardian_last_name : member.last_name}, sa JMBG ${member.guardian ? member.guardian_gov_id || 'N/A' : member.gov_id || 'N/A'}, ${member.address_street ? `${member.address_street} ${member.address_number}, ${member.address_city}` : 'N/A'}, u daljem tekstu ovim putem izjavljujem:</p>
						<ol>
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
							${member.guardian ? html`<li>Potvrđujem da sam saglasan/na kao roditelj ili zakonski staratelj da moje dete (${member.first_name} ${member.last_name}, JMBG: ${member.gov_id}), pristupi klubu i da dobrovoljno preuzimam svu odgovornost i sav rizik koji može nastati meni ili mom maloletnom detetu kao rezultat bilo kakve povrede u Klubu i sa klubom van prostorija kluba.</li>` : ''}
							<li>Da sam pročitao/la ovu "IZJAVU ODGOVORNOSTI" i da sam u potpunosti razumeo/la njegov sadržaj i pravne posledice, te da pristajem na sve rizike i posledice predočene u ovoj "izjavi odgovornosti"i svojom ozbiljnom i slobodnom voljom istu potpisujem kao znak prihvatanja iste.</li>
							<li>Na oglasnoj tabli kluba se nalazi kućni red kluba, koji sam pročitao/la i upoznao sa pravilima ponašanja tokom boravka u prostorijama kluba.</li>
						</ol>
						<h2>Izjava o pristanku/saglasnosti na obradu podataka o ličnosti</h2>
						<p>Član, kao lice na koje se podaci odnose, slobodno i bez ikakve prinude i uslovljavanja daje svoj pristanak Penjačkom klubu Adrenalin sa sedištem u Milete Protića broj 12, PIB 101662166, e-mail office@adrenalin.org.rs, broj telefona 00381631785588 (u daljem tekstu Rukovaoc) da obrađuje moje lične podatke i to:</p>
						<ul>
							<li>Ime i prezime</li>
							<li>JMBG</li>
							<li>Ulicu i broj</li>
							<li>Mesto/grad</li>
							${member.guardian ? html`<li>Ime, prezime i JMBG maloletnog lica čiji je staratelj potpisao "izjavu odgovornosti"</li>` : ''}
							<li>Svaki drugi podatak o ličnosti koji sam svojevoljno dao rukovaocu (osim posebnih vrsta podataka o ličnosti u skladu sa Zakonom)</li>
						</ul>
						<p>Navedeni podaci mogu se upotrebljavati isključivo u svrhu arhiviranja i skladištenja podataka članova kluba i u druge svrhe se ne mogu koristiti.</p>
						<p>Upoznat sam da imam pravo na opoziv pristanka za obradu podataka o ličnosti i dejstva i pravnih posledica takvog opoziva u skladu sa Zakonom, kao i da opoziv pristanka ne utiče na dopuštenost obrade koja je vršena na osnovu pristanka pre opoziva.</p>
					</div>
					<div class="member-details" style="margin: 100px;">
						<h3>Podaci o članu</h3>
						<p>Ime i prezime: ${member.first_name} ${member.last_name}</p>
						<p>ID kartice: ${member.card_id}</p>
						<p>JMBG: ${member.gov_id || 'N/A'}</p>
						<p>Adresa: ${member.address_street ? `${member.address_street} ${member.address_number}, ${member.address_city}` : 'N/A'}</p>
						<p>Email: ${member.email || 'N/A'}</p>
						<p>Telefon: ${member.phone || 'N/A'}</p>
						${member.guardian ? html`<p>Staratelj: ${member.guardian_first_name} ${member.guardian_last_name}, JMBG: ${member.guardian_gov_id}</p>` : ''}
						<p>Datum kreiranja: ${new Date(member.created_at).toLocaleDateString('sr-RS')}</p>
					</div>
					<div class="signature" style="margin: 100px;">
						<h3>Potpis</h3>
						<img src="${member.signature}" alt="Signature" style="background: #fff; max-width: 200px;" />
					</div>
					<p style="margin-top: 20px; font-style: italic;">Koristite pregledačevu funkciju Štampanje > Sačuvaj kao PDF da biste preuzeli dokument.</p>
				</div>
			</div>
		`
		const fullHtml = html`
			<!DOCTYPE html>
			<html lang="sr">
			<head>
				<meta charset="UTF-8">
				<title>Izjava o Saglasnosti - ${member.first_name} ${member.last_name}</title>
				<style>
					body { font-family: Arial, sans-serif; margin: 20px; background: #fff; color: #000; }
					.header { display: flex; align-items: center; margin-bottom: 20px; }
					.logo { width: 100px; height: 100px; margin-right: 20px; }
					.club-details { flex: 1; }
					.declaration { margin-bottom: 20px; }
					.member-details { margin-bottom: 20px; }
					.signature { margin-top: 20px; }
					img { max-width: 400px; }
					@media print { body { margin: 0; } }
				</style>
			</head>
			<body>
				${content}
			</body>
			</html>
		`
		return c.html(fullHtml)
	}
	return notFoundResponse(c, t, 'member')
})

membersRouter.post('/', async (c) => {
	const t = useTranslation(c)
	const body = await c.req.parseBody()
	const member = parseMemberData(body)
	await q.addMember(member)
	const members = await q.getMembers()
	return c.html(MemberList({ members, t }).content as string)
})

membersRouter.post('/:id', async (c) => {
	const id = Number.parseInt(c.req.param('id'), 10)
	const body = await c.req.parseBody()
	const updates = parseMemberData(body, true)
	await q.updateMember(id, updates)
	c.header('HX-Redirect', '/members')
	return c.text('', 200)
})

membersRouter.delete('/:id', async (c) => {
	const t = useTranslation(c)
	const id = Number.parseInt(c.req.param('id'), 10)
	await q.deleteMember(id)
	const members = await q.getMembers()
	return c.html(MemberList({ members, t }).content as string)
})

export default membersRouter
