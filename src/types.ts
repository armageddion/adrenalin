export interface Member {
	id: number
	first_name: string
	last_name: string
	email?: string
	phone?: string
	card_id: string
	gov_id?: string
	package_id?: number
	expires_at?: string
	image?: string
	notes?: string
	created_at: string
	updated_at: string
	address_street?: string
	address_number?: string
	address_city?: string
	guardian: number
	guardian_first_name?: string
	guardian_last_name?: string
	guardian_gov_id?: string
	notify: number
	year_of_birth: number
}

export interface Package {
	id: number
	name: string
	price?: number
	description?: string
	display_order?: number
	created_at: string
}

export interface Visit {
	id: number
	member_id: number
	visit_date?: string
	notes?: string
	created_at: string
}

export interface Message {
	id: number
	member_id: number
	subject: string
	message: string
	method: string
	created_at: string
}
