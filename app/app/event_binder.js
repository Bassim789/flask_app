export default class Event_binder {
	constructor(source, container, events) {
		this.source = source
		this.container = $(container)
		this.each_event(events)
	}
	each_event(events) {
		$.each(events, (event, actions) => {
			$.each(actions, (i, action) => {
				this.bind(event, action)
			})
		})
	}
	bind(event, action) {
		let source = this.source,
			id = '[event~="' + event + ':' + action + '"]'
		if (event === 'enter') {
			this.container.off('keyup', id).on('keyup', id, function(e) {
				if (e.which === 13) {
					return source[action](this, e)
				}
			})
		} else {
			this.container.off(event, id).on(event, id, function(e) {
				return source[action](this, e)
			})
		}
	}
}