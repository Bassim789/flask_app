$.api = function(url, action, data, callback) {
	const stack = new Error().stack
	url += '?action=' + action
	//console.log(data)
	return $.post(url, data, callback, 'json').fail((data) => {
		console.error([
			'url api: ' + url, 
			'response: ' + data.responseText,
			'stack: ' + stack
		].join('\n'))
	})
}

$.api_php = function(api_page, action, data, callback) {
	const stack = new Error().stack
	let url = '/php_api'
	url += '?api_page=' + api_page
	url += '&action=' + action
	return $.post(url, data, callback, 'json').fail((data) => {
		console.error([
			'url api: ' + api_page, 
			'response: ' + data.responseText,
			'stack: ' + stack
		].join('\n'))
	})
}
$.api_page = function(api_page, action, data, callback) {
	const stack = new Error().stack
	if(api_page === 'this'){
		api_page = window.location.pathname
	}
	let url = '/php_api'
	url += '?api_page=' + api_page
	url += '&action=' + action
	url += '&is_page=true'
	return $.post(url, data, callback, 'json').fail((data) => {
		console.error([
			'url api: ' + api_page, 
			'response: ' + data.responseText,
			'stack: ' + stack
		].join('\n'))
	})
}