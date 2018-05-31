'use strict';

$.api = function (url, action, data, callback) {
	var stack = new Error().stack;
	url += '?action=' + action;
	return $.post(url, data, callback, 'json').fail(function (data) {
		console.error(['url api: ' + url, 'response: ' + data.responseText, 'stack: ' + stack].join('\n'));
	});
};

$.api_php = function (api_page, action, data, callback) {
	var stack = new Error().stack;
	var url = 'php_api?api_page=' + api_page + '&action=' + action;
	return $.post(url, data, callback, 'json').fail(function (data) {
		console.error(['url api: ' + api_page, 'response: ' + data.responseText, 'stack: ' + stack].join('\n'));
	});
};
