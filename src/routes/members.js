var __makeTemplateObject =
	(this && this.__makeTemplateObject) ||
	((cooked, raw) => {
		if (Object.defineProperty) {
			Object.defineProperty(cooked, 'raw', { value: raw })
		} else {
			cooked.raw = raw
		}
		return cooked
	})
var __awaiter =
	(this && this.__awaiter) ||
	((thisArg, _arguments, P, generator) => {
		function adopt(value) {
			return value instanceof P
				? value
				: new P((resolve) => {
						resolve(value)
					})
		}
		return new (P || (P = Promise))((resolve, reject) => {
			function fulfilled(value) {
				try {
					step(generator.next(value))
				} catch (e) {
					reject(e)
				}
			}
			function rejected(value) {
				try {
					step(generator.throw(value))
				} catch (e) {
					reject(e)
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next())
		})
	})
var __generator =
	(this && this.__generator) ||
	((thisArg, body) => {
		var _ = {
				label: 0,
				sent: () => {
					if (t[0] & 1) throw t[1]
					return t[1]
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype)
		return (
			(g.next = verb(0)),
			(g.throw = verb(1)),
			(g.return = verb(2)),
			typeof Symbol === 'function' &&
				(g[Symbol.iterator] = function () {
					return this
				}),
			g
		)
		function verb(n) {
			return (v) => step([n, v])
		}
		function step(op) {
			if (f) throw new TypeError('Generator is already executing.')
			while ((g && ((g = 0), op[0] && (_ = 0)), _))
				try {
					if (
						((f = 1),
						y &&
							(t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t
					if (((y = 0), t)) op = [op[0] & 2, t.value]
					switch (op[0]) {
						case 0:
						case 1:
							t = op
							break
						case 4:
							_.label++
							return { value: op[1], done: false }
						case 5:
							_.label++
							y = op[1]
							op = [0]
							continue
						case 7:
							op = _.ops.pop()
							_.trys.pop()
							continue
						default:
							if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
								_ = 0
								continue
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1]
								break
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1]
								t = op
								break
							}
							if (t && _.label < t[2]) {
								_.label = t[2]
								_.ops.push(op)
								break
							}
							if (t[2]) _.ops.pop()
							_.trys.pop()
							continue
					}
					op = body.call(thisArg, _)
				} catch (e) {
					op = [6, e]
					y = 0
				} finally {
					f = t = 0
				}
			if (op[0] & 5) throw op[1]
			return { value: op[0] ? op[1] : void 0, done: true }
		}
	})
Object.defineProperty(exports, '__esModule', { value: true })
exports.parseMemberData = parseMemberData
var hono_1 = require('@intlify/hono')
var hono_2 = require('hono')
var html_1 = require('hono/html')
var i18n_1 = require('../middleware/i18n')
var q = require('../queries')
var components_1 = require('../views/components')
var members_1 = require('../views/components/members')
var layouts_1 = require('../views/layouts')
var utils_1 = require('./utils')
var utils_2 = require('../utils')
function parseMemberData(body, _isUpdate) {
	if (_isUpdate === void 0) {
		_isUpdate = false
	}
	var member = {
		first_name: body.first_name,
		last_name: body.last_name,
		email: body.email || undefined,
		phone: body.phone || undefined,
		card_id: body.card_id,
		gov_id: body.gov_id || undefined,
		package_id: body.package_id
			? (() => {
					var p = Number.parseInt(body.package_id, 10)
					return Number.isNaN(p) ? undefined : p
				})()
			: undefined,
		expires_at: body.expires_at || undefined,
		image: body.image || undefined,
		notes: body.notes || undefined,
		address_street: body.address_street || undefined,
		address_number: body.address_number || undefined,
		address_city: body.address_city || undefined,
		guardian: body.guardian === 'on' ? 1 : 0,
		guardian_first_name: body.guardian_first_name || undefined,
		guardian_last_name: body.guardian_last_name || undefined,
		guardian_gov_id: body.guardian_gov_id || undefined,
		notify: body.notify !== 'off' ? 1 : 0,
		year_of_birth: (() => {
			var y = Number.parseInt(body.year_of_birth, 10)
			return Number.isNaN(y) ? undefined : y
		})(),
	}
	return member
}
var membersRouter = new hono_2.Hono()
membersRouter.get('/', (c) =>
	__awaiter(void 0, void 0, void 0, function () {
		var t,
			locale,
			page,
			limit,
			search,
			append,
			members,
			_a,
			totalMembers,
			_b,
			pagination,
			_c,
			_content,
			script,
			searchInput,
			content
		return __generator(this, (_d) => {
			switch (_d.label) {
				case 0:
					return [4 /*yield*/, (0, hono_1.useTranslation)(c)]
				case 1:
					t = _d.sent()
					locale = (0, i18n_1.customLocaleDetector)(c)
					page = Number.parseInt(c.req.query('page') || '1', 10)
					limit = Number.parseInt(c.req.query('limit') || '100', 10)
					search = c.req.query('search') || ''
					append = c.req.query('append') === '1'
					if (!search) return [3 /*break*/, 3]
					return [4 /*yield*/, q.searchMembersPaginated(search, page, limit)]
				case 2:
					_a = _d.sent()
					return [3 /*break*/, 5]
				case 3:
					return [4 /*yield*/, q.getMembersPaginated(page, limit)]
				case 4:
					_a = _d.sent()
					_d.label = 5
				case 5:
					members = _a
					if (!search) return [3 /*break*/, 7]
					return [4 /*yield*/, q.searchMembersCount(search)]
				case 6:
					_b = _d.sent()
					return [3 /*break*/, 9]
				case 7:
					return [4 /*yield*/, q.getMembersCount()]
				case 8:
					_b = _d.sent()
					_d.label = 9
				case 9:
					totalMembers = _b
					pagination = {
						currentPage: page,
						totalPages: Math.ceil(totalMembers / limit),
						limit: limit,
						totalItems: totalMembers,
						hasNext: page < Math.ceil(totalMembers / limit),
						hasPrev: page > 1,
					}
					// If append mode, return only the table rows and next sentinel
					if (append) {
						return [
							2 /*return*/,
							c.html(
								(0, html_1.html)(
									templateObject_1 || (templateObject_1 = __makeTemplateObject(['', ''], ['', ''])),
									(0, members_1.renderMemberRows)(members, t),
								),
							),
						]
					}
					;(_c = (0, components_1.MemberList)({ members: members, t: t, pagination: pagination, search: search })),
						(_content = _c.content),
						(script = _c.script)
					searchInput = (0, html_1.html)(
						templateObject_2 ||
							(templateObject_2 = __makeTemplateObject(
								[
									'\n\t\t<div class="p-6">\n\t\t\t<input\n\t\t\t\ttype="text"\n\t\t\t\tplaceholder="',
									'"\n\t\t\t\tclass="w-full p-2 border rounded"\n\t\t\t\thx-get="?page=1&limit=',
									'"\n\t\t\t\thx-target="#member-list-wrapper"\n\t\t\t\thx-swap="outerHTML"\n\t\t\t\thx-trigger="input changed delay:300ms"\n\t\t\t\tname="search"\n\t\t\t\tvalue="',
									'"\n\t\t\t/>\n\t\t</div>\n\t',
								],
								[
									'\n\t\t<div class="p-6">\n\t\t\t<input\n\t\t\t\ttype="text"\n\t\t\t\tplaceholder="',
									'"\n\t\t\t\tclass="w-full p-2 border rounded"\n\t\t\t\thx-get="?page=1&limit=',
									'"\n\t\t\t\thx-target="#member-list-wrapper"\n\t\t\t\thx-swap="outerHTML"\n\t\t\t\thx-trigger="input changed delay:300ms"\n\t\t\t\tname="search"\n\t\t\t\tvalue="',
									'"\n\t\t\t/>\n\t\t</div>\n\t',
								],
							)),
						t('components.members.searchPlaceholder'),
						pagination.limit,
						search || '',
					)
					content = (0, html_1.html)(
						templateObject_3 ||
							(templateObject_3 = __makeTemplateObject(
								[
									'\n\t\t<div id="member-form"></div>\n\t\t',
									'\n\t\t<div id="member-list-wrapper">\n\t\t\t',
									'\n\t\t</div>\n\t',
								],
								[
									'\n\t\t<div id="member-form"></div>\n\t\t',
									'\n\t\t<div id="member-list-wrapper">\n\t\t\t',
									'\n\t\t</div>\n\t',
								],
							)),
						c.req.header('HX-Request') ? '' : searchInput,
						_content,
					)
					if (c.req.header('HX-Request')) {
						return [2 /*return*/, c.html(content)]
					}
					return [
						2 /*return*/,
						c.html(
							(0, layouts_1.PageLayout)({
								title: t('components.members.title'),
								content: content,
								script: script,
								locale: locale,
								t: t,
							}),
						),
					]
			}
		})
	}),
)
membersRouter.get('/new', (c) =>
	__awaiter(void 0, void 0, void 0, function () {
		var t, locale, packages, _a, content, script
		return __generator(this, (_b) => {
			switch (_b.label) {
				case 0:
					return [4 /*yield*/, (0, hono_1.useTranslation)(c)]
				case 1:
					t = _b.sent()
					locale = (0, i18n_1.customLocaleDetector)(c)
					return [4 /*yield*/, q.getPackages()]
				case 2:
					packages = _b.sent()
					;(_a = (0, components_1.MemberForm)({ packages: packages, member: null, t: t })),
						(content = _a.content),
						(script = _a.script)
					return [
						2 /*return*/,
						c.html(
							(0, layouts_1.PageLayout)({
								title: t('components.memberForm.addTitle'),
								content: content,
								script: script,
								locale: locale,
								t: t,
							}),
						),
					]
			}
		})
	}),
)
membersRouter.get('/:id', (c) =>
	__awaiter(void 0, void 0, void 0, function () {
		var t, locale, id, member, visits, packages, memberPackage, memberContent
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, (0, hono_1.useTranslation)(c)]
				case 1:
					t = _a.sent()
					locale = (0, i18n_1.customLocaleDetector)(c)
					id = Number.parseInt(c.req.param('id'), 10)
					return [4 /*yield*/, q.getMember(id)]
				case 2:
					member = _a.sent()
					if (!member) return [3 /*break*/, 5]
					return [4 /*yield*/, q.getVisitsByMemberId(id)]
				case 3:
					visits = _a.sent()
					return [4 /*yield*/, q.getPackages()]
				case 4:
					packages = _a.sent()
					memberPackage = packages.find((p) => p.id === member.package_id)
					memberContent = (0, html_1.html)(
						templateObject_4 ||
							(templateObject_4 = __makeTemplateObject(
								[
									'\n\t\t\t<div class="flex max-w-6xl w-full mx-auto my-6 gap-6">\n\t\t\t\t',
									'\n\t\t\t\t',
									'\n\t\t\t</div>\n\t\t',
								],
								[
									'\n\t\t\t<div class="flex max-w-6xl w-full mx-auto my-6 gap-6">\n\t\t\t\t',
									'\n\t\t\t\t',
									'\n\t\t\t</div>\n\t\t',
								],
							)),
						(0, members_1.MemberCard)({ member: member, memberPackage: memberPackage, t: t }),
						(0, components_1.VisitList)({ visits: visits, t: t, member: member }).content,
					)
					if (c.req.header('HX-Request')) {
						return [2 /*return*/, c.html(memberContent)]
					}
					return [
						2 /*return*/,
						c.html(
							(0, layouts_1.PageLayout)({
								title: ''.concat(member.first_name, ' ').concat(member.last_name),
								content: memberContent,
								locale: locale,
								t: t,
							}),
						),
					]
				case 5:
					return [2 /*return*/, (0, utils_1.notFoundResponse)(c, t, 'member')]
			}
		})
	}),
)
membersRouter.get('/:id/edit', (c) =>
	__awaiter(void 0, void 0, void 0, function () {
		var t, locale, id, member, packages, _a, _content, script, content
		return __generator(this, (_b) => {
			switch (_b.label) {
				case 0:
					return [4 /*yield*/, (0, hono_1.useTranslation)(c)]
				case 1:
					t = _b.sent()
					locale = (0, i18n_1.customLocaleDetector)(c)
					id = Number.parseInt(c.req.param('id'), 10)
					return [4 /*yield*/, q.getMember(id)]
				case 2:
					member = _b.sent()
					return [4 /*yield*/, q.getPackages()]
				case 3:
					packages = _b.sent()
					if (member) {
						;(_a = (0, components_1.MemberForm)({ packages: packages, member: member, t: t })),
							(_content = _a.content),
							(script = _a.script)
						content = (0, html_1.html)(
							templateObject_5 ||
								(templateObject_5 = __makeTemplateObject(
									['\n\t\t\t<div id="member-form">\n\t\t\t\t', '\n\t\t\t</div>\n\t\t'],
									['\n\t\t\t<div id="member-form">\n\t\t\t\t', '\n\t\t\t</div>\n\t\t'],
								)),
							_content,
						)
						if (c.req.header('HX-Request')) {
							return [2 /*return*/, c.html(content)]
						}
						return [
							2 /*return*/,
							c.html(
								(0, layouts_1.PageLayout)({
									title: t('components.memberForm.editTitle'),
									content: content,
									script: script,
									locale: locale,
									t: t,
								}),
							),
						]
					}
					return [2 /*return*/, (0, utils_1.notFoundResponse)(c, t, 'member')]
			}
		})
	}),
)
membersRouter.get('/:id/consent', (c) =>
	__awaiter(void 0, void 0, void 0, function () {
		var t, id, member, logoSrc, content, fullHtml
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, (0, hono_1.useTranslation)(c)]
				case 1:
					t = _a.sent()
					id = Number.parseInt(c.req.param('id'), 10)
					return [4 /*yield*/, q.getMember(id)]
				case 2:
					member = _a.sent()
					if (member === null || member === void 0 ? void 0 : member.signature) {
						logoSrc = '/public/assets/adrenalin_logo.jpg'
						content = (0, html_1.html)(
							templateObject_9 ||
								(templateObject_9 = __makeTemplateObject(
									[
										'\n\t\t\t<div class="p-4 w-full max-w-4xl mx-auto">\n\t\t\t\t<div class="bg-background p-6 rounded-lg shadow-md">\n\t\t\t\t\t<div class="club-name" style="text-align: center; margin-bottom: 20px;">\n\t\t\t\t\t\t<h1 style="text-align: center; margin: 50px;">PENJA\u010CKI KLUB ADRENALIN NOVI SAD</h1>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">\n\t\t\t\t\t\t<div class="logo" style="width: 350px; height: auto; margin-right: 20px;">\n\t\t\t\t\t\t\t<img src="',
										'" width="350" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="club-details" style="text-align: right; margin-right: 50px">\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\tMILETE PROTI\u0106A 12, 21000 NOVI SAD<br/>\n\t\t\t\t\t\t\t\tTelefon: +381.63.178.55.88<br/>\n\t\t\t\t\t\t\t\tWebsite: WWW.ADRENALIN.ORG.RS<br/>\n\t\t\t\t\t\t\t\tEmail: OFFICE@ADRENALIN.ORG.RS<br/>\n\t\t\t\t\t\t\t\tPIB: 101662166<br/>\n\t\t\t\t\t\t\t\tMATI\u010CNI BROJ: 08715181<br/>\n\t\t\t\t\t\t\t\tBROJ \u017DIRO RA\u010CUNA: 160-547671-49<br/>\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="declaration" style="margin-bottom: 20px; margin-right: 100px; margin-left:100px;">\n\t\t\t\t\t\t<h2>Izjava odgovornosti</h2>\n\t\t\t\t\t\t<p>Ja ',
										' ',
										', sa JMBG ',
										', ',
										', u daljem tekstu ovim putem izjavljujem:</p>\n\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t<li>Da sam razumeo da je aktivnost sportsko penjanje i planinarenje ekstreman sport, te da postoji opasnost od povreda i nesre\u0107nih slu\u010Dajeva koju bilo kakva koli\u010Dina brige, opreza, nastave ili ekspertize mo\u017Ee potpuno eliminisati. Ja izri\u010Dito i dobrovoljno preuzimam sav rizik od povreda ili smrti ukoliko se dese dok u\u010Destvujem u aktivnostima sportskog penjanja i planinarenja u klubu i sa klubom van kluba.</li>\n\t\t\t\t\t\t\t<li>Na pole\u0111ini "izjave odgovornosti" nalazi se izjava o pristanku - saglasnosti za obradu podataka o li\u010Dnosti.</li>\n\t\t\t\t\t\t\t<li>Obavezujem se da \u0107u opremu koju budem koristio/la u ovim prostorijama, koristiti na bezbedan na\u010Din, u skladu sa uputstvom koje sam dobio/la od instruktora kluba o kori\u0161\u0107enju opreme, kako ne bih ugrozio/la \u017Eivote ljudi i imovine bilo kog pojedinca. A ukoliko koristim svoju opremu (u\u017Ee za penjenje, sigurnosni pojas, sprave za osiguravanje sebe i partnera), obavezujem se da \u0107u je koristiti na bezbedan na\u010Din kako ne bih ugrozio/la \u017Eivote ljudi i imovine pojedinca, kao i da preuzimam spostveni rizik za kori\u0161\u0107enje sopstvene opreme.</li>\n\t\t\t\t\t\t\t<li>Da nisam pod uticajem droge, alkohola ili drugih psihoaktivnih supstanci koje bi mogle da uti\u010Du na pravilno rasu\u0111ivanje pri sportskom penjanju i planinarenju.</li>\n\t\t\t\t\t\t\t<li>Da sam u dobrom zdravstvenom stanju i da kod mene ne postoji ni jedna zdravstvena smetnja koja bi mogla uticati na bavljenje aktivnostima sportskog penjanja i planinarenja.</li>\n\t\t\t\t\t\t\t<li>Da sam blagovremeno upoznat/a sa svim opasnostima i rizicima koje mogu da nastanu prilikom aktivnosti sportskog penjanja i planinarenja u Klubu i sa klubom.</li>\n\t\t\t\t\t\t\t<li>Da sam blagovremeno upozoren/a da li\u010Dne stvari koje ostavim u svla\u010Dionici kluba ili bilo gde van sopostvenog nadzora, to \u010Dinim na sopstvenu odgovornost.</li>\n\t\t\t\t\t\t\t<li>Da mi je Klub preporu\u010Dio da se osiguram kod osiguravaju\u0107eg dru\u0161tva od posledica nesre\u0107nog slu\u010Daja.</li>\n\t\t\t\t\t\t\t<li>Da sam dobio/la punu priliku da postavim Klubu bilo koje pitanje u vezi sa aktivnostima sportskog penjanja, kao i planinarenja i dobio odgovor, \u0161to i potvr\u0111ujem potpisivanjem ove "izjave odgovornosti".</li>\n\t\t\t\t\t\t\t<li>Da sam saglasan/na da sam dobio/la adekvatnu priliku da pro\u010Ditam i razumem tekst ove "izjave odgovornosti", te da ista nije predo\u010Dena u poslednjem trenutku.</li>\n\t\t\t\t\t\t\t<li>Potvr\u0111ujem da sam punoletan/na.</li>\n\t\t\t\t\t\t\t',
										'\n\t\t\t\t\t\t\t<li>Da sam pro\u010Ditao/la ovu "IZJAVU ODGOVORNOSTI" i da sam u potpunosti razumeo/la njegov sadr\u017Eaj i pravne posledice, te da pristajem na sve rizike i posledice predo\u010Dene u ovoj "izjavi odgovornosti"i svojom ozbiljnom i slobodnom voljom istu potpisujem kao znak prihvatanja iste.</li>\n\t\t\t\t\t\t\t<li>Na oglasnoj tabli kluba se nalazi ku\u0107ni red kluba, koji sam pro\u010Ditao/la i upoznao sa pravilima pona\u0161anja tokom boravka u prostorijama kluba.</li>\n\t\t\t\t\t\t</ol>\n\t\t\t\t\t\t<h2>Izjava o pristanku/saglasnosti na obradu podataka o li\u010Dnosti</h2>\n\t\t\t\t\t\t<p>\u010Clan, kao lice na koje se podaci odnose, slobodno i bez ikakve prinude i uslovljavanja daje svoj pristanak Penja\u010Dkom klubu Adrenalin sa sedi\u0161tem u Milete Proti\u0107a broj 12, PIB 101662166, e-mail office@adrenalin.org.rs, broj telefona 00381631785588 (u daljem tekstu Rukovaoc) da obra\u0111uje moje li\u010Dne podatke i to:</p>\n\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t<li>Ime i prezime</li>\n\t\t\t\t\t\t\t<li>JMBG</li>\n\t\t\t\t\t\t\t<li>Ulicu i broj</li>\n\t\t\t\t\t\t\t<li>Mesto/grad</li>\n\t\t\t\t\t\t\t',
										'\n\t\t\t\t\t\t\t<li>Svaki drugi podatak o li\u010Dnosti koji sam svojevoljno dao rukovaocu (osim posebnih vrsta podataka o li\u010Dnosti u skladu sa Zakonom)</li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t<p>Navedeni podaci mogu se upotrebljavati isklju\u010Divo u svrhu arhiviranja i skladi\u0161tenja podataka \u010Dlanova kluba i u druge svrhe se ne mogu koristiti.</p>\n\t\t\t\t\t\t<p>Upoznat sam da imam pravo na opoziv pristanka za obradu podataka o li\u010Dnosti i dejstva i pravnih posledica takvog opoziva u skladu sa Zakonom, kao i da opoziv pristanka ne uti\u010De na dopu\u0161tenost obrade koja je vr\u0161ena na osnovu pristanka pre opoziva.</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="member-details" style="margin: 100px;">\n\t\t\t\t\t\t<h3>Podaci o \u010Dlanu</h3>\n\t\t\t\t\t\t<p>Ime i prezime: ',
										' ',
										'</p>\n\t\t\t\t\t\t<p>ID kartice: ',
										'</p>\n\t\t\t\t\t\t<p>JMBG: ',
										'</p>\n\t\t\t\t\t\t<p>Adresa: ',
										'</p>\n\t\t\t\t\t\t<p>Email: ',
										'</p>\n\t\t\t\t\t\t<p>Telefon: ',
										'</p>\n\t\t\t\t\t\t',
										'\n\t\t\t\t\t\t<p>Datum kreiranja: ',
										'</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="signature" style="margin: 100px;">\n\t\t\t\t\t\t<h3>Potpis</h3>\n\t\t\t\t\t\t<img src="',
										'" alt="Signature" style="background: #fff; max-width: 200px;" />\n\t\t\t\t\t</div>\n\t\t\t\t\t<p style="margin-top: 20px; font-style: italic;">Koristite pregleda\u010Devu funkciju \u0160tampanje > Sa\u010Duvaj kao PDF da biste preuzeli dokument.</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t',
									],
									[
										'\n\t\t\t<div class="p-4 w-full max-w-4xl mx-auto">\n\t\t\t\t<div class="bg-background p-6 rounded-lg shadow-md">\n\t\t\t\t\t<div class="club-name" style="text-align: center; margin-bottom: 20px;">\n\t\t\t\t\t\t<h1 style="text-align: center; margin: 50px;">PENJA\u010CKI KLUB ADRENALIN NOVI SAD</h1>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">\n\t\t\t\t\t\t<div class="logo" style="width: 350px; height: auto; margin-right: 20px;">\n\t\t\t\t\t\t\t<img src="',
										'" width="350" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="club-details" style="text-align: right; margin-right: 50px">\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\tMILETE PROTI\u0106A 12, 21000 NOVI SAD<br/>\n\t\t\t\t\t\t\t\tTelefon: +381.63.178.55.88<br/>\n\t\t\t\t\t\t\t\tWebsite: WWW.ADRENALIN.ORG.RS<br/>\n\t\t\t\t\t\t\t\tEmail: OFFICE@ADRENALIN.ORG.RS<br/>\n\t\t\t\t\t\t\t\tPIB: 101662166<br/>\n\t\t\t\t\t\t\t\tMATI\u010CNI BROJ: 08715181<br/>\n\t\t\t\t\t\t\t\tBROJ \u017DIRO RA\u010CUNA: 160-547671-49<br/>\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="declaration" style="margin-bottom: 20px; margin-right: 100px; margin-left:100px;">\n\t\t\t\t\t\t<h2>Izjava odgovornosti</h2>\n\t\t\t\t\t\t<p>Ja ',
										' ',
										', sa JMBG ',
										', ',
										', u daljem tekstu ovim putem izjavljujem:</p>\n\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t<li>Da sam razumeo da je aktivnost sportsko penjanje i planinarenje ekstreman sport, te da postoji opasnost od povreda i nesre\u0107nih slu\u010Dajeva koju bilo kakva koli\u010Dina brige, opreza, nastave ili ekspertize mo\u017Ee potpuno eliminisati. Ja izri\u010Dito i dobrovoljno preuzimam sav rizik od povreda ili smrti ukoliko se dese dok u\u010Destvujem u aktivnostima sportskog penjanja i planinarenja u klubu i sa klubom van kluba.</li>\n\t\t\t\t\t\t\t<li>Na pole\u0111ini "izjave odgovornosti" nalazi se izjava o pristanku - saglasnosti za obradu podataka o li\u010Dnosti.</li>\n\t\t\t\t\t\t\t<li>Obavezujem se da \u0107u opremu koju budem koristio/la u ovim prostorijama, koristiti na bezbedan na\u010Din, u skladu sa uputstvom koje sam dobio/la od instruktora kluba o kori\u0161\u0107enju opreme, kako ne bih ugrozio/la \u017Eivote ljudi i imovine bilo kog pojedinca. A ukoliko koristim svoju opremu (u\u017Ee za penjenje, sigurnosni pojas, sprave za osiguravanje sebe i partnera), obavezujem se da \u0107u je koristiti na bezbedan na\u010Din kako ne bih ugrozio/la \u017Eivote ljudi i imovine pojedinca, kao i da preuzimam spostveni rizik za kori\u0161\u0107enje sopstvene opreme.</li>\n\t\t\t\t\t\t\t<li>Da nisam pod uticajem droge, alkohola ili drugih psihoaktivnih supstanci koje bi mogle da uti\u010Du na pravilno rasu\u0111ivanje pri sportskom penjanju i planinarenju.</li>\n\t\t\t\t\t\t\t<li>Da sam u dobrom zdravstvenom stanju i da kod mene ne postoji ni jedna zdravstvena smetnja koja bi mogla uticati na bavljenje aktivnostima sportskog penjanja i planinarenja.</li>\n\t\t\t\t\t\t\t<li>Da sam blagovremeno upoznat/a sa svim opasnostima i rizicima koje mogu da nastanu prilikom aktivnosti sportskog penjanja i planinarenja u Klubu i sa klubom.</li>\n\t\t\t\t\t\t\t<li>Da sam blagovremeno upozoren/a da li\u010Dne stvari koje ostavim u svla\u010Dionici kluba ili bilo gde van sopostvenog nadzora, to \u010Dinim na sopstvenu odgovornost.</li>\n\t\t\t\t\t\t\t<li>Da mi je Klub preporu\u010Dio da se osiguram kod osiguravaju\u0107eg dru\u0161tva od posledica nesre\u0107nog slu\u010Daja.</li>\n\t\t\t\t\t\t\t<li>Da sam dobio/la punu priliku da postavim Klubu bilo koje pitanje u vezi sa aktivnostima sportskog penjanja, kao i planinarenja i dobio odgovor, \u0161to i potvr\u0111ujem potpisivanjem ove "izjave odgovornosti".</li>\n\t\t\t\t\t\t\t<li>Da sam saglasan/na da sam dobio/la adekvatnu priliku da pro\u010Ditam i razumem tekst ove "izjave odgovornosti", te da ista nije predo\u010Dena u poslednjem trenutku.</li>\n\t\t\t\t\t\t\t<li>Potvr\u0111ujem da sam punoletan/na.</li>\n\t\t\t\t\t\t\t',
										'\n\t\t\t\t\t\t\t<li>Da sam pro\u010Ditao/la ovu "IZJAVU ODGOVORNOSTI" i da sam u potpunosti razumeo/la njegov sadr\u017Eaj i pravne posledice, te da pristajem na sve rizike i posledice predo\u010Dene u ovoj "izjavi odgovornosti"i svojom ozbiljnom i slobodnom voljom istu potpisujem kao znak prihvatanja iste.</li>\n\t\t\t\t\t\t\t<li>Na oglasnoj tabli kluba se nalazi ku\u0107ni red kluba, koji sam pro\u010Ditao/la i upoznao sa pravilima pona\u0161anja tokom boravka u prostorijama kluba.</li>\n\t\t\t\t\t\t</ol>\n\t\t\t\t\t\t<h2>Izjava o pristanku/saglasnosti na obradu podataka o li\u010Dnosti</h2>\n\t\t\t\t\t\t<p>\u010Clan, kao lice na koje se podaci odnose, slobodno i bez ikakve prinude i uslovljavanja daje svoj pristanak Penja\u010Dkom klubu Adrenalin sa sedi\u0161tem u Milete Proti\u0107a broj 12, PIB 101662166, e-mail office@adrenalin.org.rs, broj telefona 00381631785588 (u daljem tekstu Rukovaoc) da obra\u0111uje moje li\u010Dne podatke i to:</p>\n\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t<li>Ime i prezime</li>\n\t\t\t\t\t\t\t<li>JMBG</li>\n\t\t\t\t\t\t\t<li>Ulicu i broj</li>\n\t\t\t\t\t\t\t<li>Mesto/grad</li>\n\t\t\t\t\t\t\t',
										'\n\t\t\t\t\t\t\t<li>Svaki drugi podatak o li\u010Dnosti koji sam svojevoljno dao rukovaocu (osim posebnih vrsta podataka o li\u010Dnosti u skladu sa Zakonom)</li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t<p>Navedeni podaci mogu se upotrebljavati isklju\u010Divo u svrhu arhiviranja i skladi\u0161tenja podataka \u010Dlanova kluba i u druge svrhe se ne mogu koristiti.</p>\n\t\t\t\t\t\t<p>Upoznat sam da imam pravo na opoziv pristanka za obradu podataka o li\u010Dnosti i dejstva i pravnih posledica takvog opoziva u skladu sa Zakonom, kao i da opoziv pristanka ne uti\u010De na dopu\u0161tenost obrade koja je vr\u0161ena na osnovu pristanka pre opoziva.</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="member-details" style="margin: 100px;">\n\t\t\t\t\t\t<h3>Podaci o \u010Dlanu</h3>\n\t\t\t\t\t\t<p>Ime i prezime: ',
										' ',
										'</p>\n\t\t\t\t\t\t<p>ID kartice: ',
										'</p>\n\t\t\t\t\t\t<p>JMBG: ',
										'</p>\n\t\t\t\t\t\t<p>Adresa: ',
										'</p>\n\t\t\t\t\t\t<p>Email: ',
										'</p>\n\t\t\t\t\t\t<p>Telefon: ',
										'</p>\n\t\t\t\t\t\t',
										'\n\t\t\t\t\t\t<p>Datum kreiranja: ',
										'</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="signature" style="margin: 100px;">\n\t\t\t\t\t\t<h3>Potpis</h3>\n\t\t\t\t\t\t<img src="',
										'" alt="Signature" style="background: #fff; max-width: 200px;" />\n\t\t\t\t\t</div>\n\t\t\t\t\t<p style="margin-top: 20px; font-style: italic;">Koristite pregleda\u010Devu funkciju \u0160tampanje > Sa\u010Duvaj kao PDF da biste preuzeli dokument.</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t',
									],
								)),
							logoSrc,
							member.guardian ? member.guardian_first_name : member.first_name,
							member.guardian ? member.guardian_last_name : member.last_name,
							member.guardian ? member.guardian_gov_id || 'N/A' : member.gov_id || 'N/A',
							member.address_street
								? ''.concat(member.address_street, ' ').concat(member.address_number, ', ').concat(member.address_city)
								: 'N/A',
							member.guardian
								? (0, html_1.html)(
										templateObject_6 ||
											(templateObject_6 = __makeTemplateObject(
												[
													'<li>Potvr\u0111ujem da sam saglasan/na kao roditelj ili zakonski staratelj da moje dete (',
													' ',
													', JMBG: ',
													'), pristupi klubu i da dobrovoljno preuzimam svu odgovornost i sav rizik koji mo\u017Ee nastati meni ili mom maloletnom detetu kao rezultat bilo kakve povrede u Klubu i sa klubom van prostorija kluba.</li>',
												],
												[
													'<li>Potvr\u0111ujem da sam saglasan/na kao roditelj ili zakonski staratelj da moje dete (',
													' ',
													', JMBG: ',
													'), pristupi klubu i da dobrovoljno preuzimam svu odgovornost i sav rizik koji mo\u017Ee nastati meni ili mom maloletnom detetu kao rezultat bilo kakve povrede u Klubu i sa klubom van prostorija kluba.</li>',
												],
											)),
										member.first_name,
										member.last_name,
										member.gov_id,
									)
								: '',
							member.guardian
								? (0, html_1.html)(
										templateObject_7 ||
											(templateObject_7 = __makeTemplateObject(
												[
													'<li>Ime, prezime i JMBG maloletnog lica \u010Diji je staratelj potpisao "izjavu odgovornosti"</li>',
												],
												[
													'<li>Ime, prezime i JMBG maloletnog lica \u010Diji je staratelj potpisao "izjavu odgovornosti"</li>',
												],
											)),
									)
								: '',
							member.first_name,
							member.last_name,
							member.card_id,
							member.gov_id || 'N/A',
							member.address_street
								? ''.concat(member.address_street, ' ').concat(member.address_number, ', ').concat(member.address_city)
								: 'N/A',
							member.email || 'N/A',
							member.phone || 'N/A',
							member.guardian
								? (0, html_1.html)(
										templateObject_8 ||
											(templateObject_8 = __makeTemplateObject(
												['<p>Staratelj: ', ' ', ', JMBG: ', '</p>'],
												['<p>Staratelj: ', ' ', ', JMBG: ', '</p>'],
											)),
										member.guardian_first_name,
										member.guardian_last_name,
										member.guardian_gov_id,
									)
								: '',
							(0, utils_2.formatDate)(member.created_at),
							member.signature,
						)
						fullHtml = (0, html_1.html)(
							templateObject_10 ||
								(templateObject_10 = __makeTemplateObject(
									[
										'\n\t\t\t<!DOCTYPE html>\n\t\t\t<html lang="sr">\n\t\t\t<head>\n\t\t\t\t<meta charset="UTF-8">\n\t\t\t\t<title>Izjava o Saglasnosti - ',
										' ',
										'</title>\n\t\t\t\t<style>\n\t\t\t\t\tbody { font-family: Arial, sans-serif; margin: 20px; background: #fff; color: #000; }\n\t\t\t\t\t.header { display: flex; align-items: center; margin-bottom: 20px; }\n\t\t\t\t\t.logo { width: 100px; height: 100px; margin-right: 20px; }\n\t\t\t\t\t.club-details { flex: 1; }\n\t\t\t\t\t.declaration { margin-bottom: 20px; }\n\t\t\t\t\t.member-details { margin-bottom: 20px; }\n\t\t\t\t\t.signature { margin-top: 20px; }\n\t\t\t\t\timg { max-width: 400px; }\n\t\t\t\t\t@media print { body { margin: 0; } }\n\t\t\t\t</style>\n\t\t\t</head>\n\t\t\t<body>\n\t\t\t\t',
										'\n\t\t\t</body>\n\t\t\t</html>\n\t\t',
									],
									[
										'\n\t\t\t<!DOCTYPE html>\n\t\t\t<html lang="sr">\n\t\t\t<head>\n\t\t\t\t<meta charset="UTF-8">\n\t\t\t\t<title>Izjava o Saglasnosti - ',
										' ',
										'</title>\n\t\t\t\t<style>\n\t\t\t\t\tbody { font-family: Arial, sans-serif; margin: 20px; background: #fff; color: #000; }\n\t\t\t\t\t.header { display: flex; align-items: center; margin-bottom: 20px; }\n\t\t\t\t\t.logo { width: 100px; height: 100px; margin-right: 20px; }\n\t\t\t\t\t.club-details { flex: 1; }\n\t\t\t\t\t.declaration { margin-bottom: 20px; }\n\t\t\t\t\t.member-details { margin-bottom: 20px; }\n\t\t\t\t\t.signature { margin-top: 20px; }\n\t\t\t\t\timg { max-width: 400px; }\n\t\t\t\t\t@media print { body { margin: 0; } }\n\t\t\t\t</style>\n\t\t\t</head>\n\t\t\t<body>\n\t\t\t\t',
										'\n\t\t\t</body>\n\t\t\t</html>\n\t\t',
									],
								)),
							member.first_name,
							member.last_name,
							content,
						)
						return [2 /*return*/, c.html(fullHtml)]
					}
					return [2 /*return*/, (0, utils_1.notFoundResponse)(c, t, 'member')]
			}
		})
	}),
)
membersRouter.post('/', (c) =>
	__awaiter(void 0, void 0, void 0, function () {
		var t, body, member, error_1, message
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, (0, hono_1.useTranslation)(c)]
				case 1:
					t = _a.sent()
					return [4 /*yield*/, c.req.parseBody()]
				case 2:
					body = _a.sent()
					member = parseMemberData(body)
					_a.label = 3
				case 3:
					_a.trys.push([3, 5, undefined, 6])
					return [4 /*yield*/, q.addMember(member)]
				case 4:
					_a.sent()
					return [3 /*break*/, 6]
				case 5:
					error_1 = _a.sent()
					message = error_1.message || t('error')
					c.header('X-Toast', message)
					c.header('X-Toast-Type', 'error')
					return [2 /*return*/, c.text(message, 500)]
				case 6:
					c.header('X-Toast', t('messages.memberCreated'))
					c.header('X-Toast-Type', 'success')
					c.header('HX-Redirect', '/')
					return [2 /*return*/, c.text('', 200)]
			}
		})
	}),
)
membersRouter.post('/:id', (c) =>
	__awaiter(void 0, void 0, void 0, function () {
		var t, id, body, updates, error_2, message
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, (0, hono_1.useTranslation)(c)]
				case 1:
					t = _a.sent()
					id = Number.parseInt(c.req.param('id'), 10)
					return [4 /*yield*/, c.req.parseBody()]
				case 2:
					body = _a.sent()
					updates = parseMemberData(body, true)
					_a.label = 3
				case 3:
					_a.trys.push([3, 5, undefined, 6])
					return [4 /*yield*/, q.updateMember(id, updates)]
				case 4:
					_a.sent()
					return [3 /*break*/, 6]
				case 5:
					error_2 = _a.sent()
					message = error_2.message || t('error')
					c.header('X-Toast', message)
					c.header('X-Toast-Type', 'error')
					return [2 /*return*/, c.text(message, 500)]
				case 6:
					c.header('X-Toast', t('messages.memberUpdated'))
					c.header('X-Toast-Type', 'success')
					c.header('HX-Redirect', '/members')
					return [2 /*return*/, c.text('', 200)]
			}
		})
	}),
)
membersRouter.delete('/:id', (c) =>
	__awaiter(void 0, void 0, void 0, function () {
		var t, id, error_3, message
		return __generator(this, (_a) => {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, (0, hono_1.useTranslation)(c)]
				case 1:
					t = _a.sent()
					id = Number.parseInt(c.req.param('id'), 10)
					_a.label = 2
				case 2:
					_a.trys.push([2, 4, undefined, 5])
					return [4 /*yield*/, q.deleteMember(id)]
				case 3:
					_a.sent()
					return [3 /*break*/, 5]
				case 4:
					error_3 = _a.sent()
					message = error_3.message || t('error')
					c.header('X-Toast', message)
					c.header('X-Toast-Type', 'error')
					return [2 /*return*/, c.text(message, 500)]
				case 5:
					c.header('X-Toast', t('messages.memberDeleted'))
					c.header('X-Toast-Type', 'success')
					c.header('HX-Redirect', '/')
					return [2 /*return*/, c.text('', 200)]
			}
		})
	}),
)
exports.default = membersRouter
var templateObject_1,
	templateObject_2,
	templateObject_3,
	templateObject_4,
	templateObject_5,
	templateObject_6,
	templateObject_7,
	templateObject_8,
	templateObject_9,
	templateObject_10
