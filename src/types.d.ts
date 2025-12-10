import 'typed-htmx'

declare global {
	namespace Hono {
		interface HTMLAttributes extends HtmxAttributes {}
		interface ContextVariableMap {
			user: { id: number; username: string; role: string }
		}
	}
}
