const axios = require('axios');
const { compile } = require('path-to-regexp');
const { isEmpty } = require('./generic');

exports.postRequest = async (baseURL, route, headers = {}, body) => {
	try {
		baseURL = baseURL.replace(/\/$/, '');
		let url = baseURL + route;
		console.log('URL: ', url);
		console.log('HEADERS: ', JSON.stringify(headers, null, 2));
		console.log('BODY: ', JSON.stringify(body, null, 2));
		const response = await axios.post(url, body, { headers, timeout: 3000 });
		console.log('RESPONSE: ', JSON.stringify(response.data, null, 2));
		return response.data;
	} catch (err) {
		if (err.response) {
			console.log('Response Data: ', err.response.data);
			console.log('Response Status:', err.response.status);
			console.log('Response Headers', err.response.headers);
		} else if (err.request) console.log(err.request);
		else console.log('Error: ', err.message);
		console.log('Request CONFIG: ', err.config);
	}
};

exports.getRequest = async (baseURL, route, headers = {}, pathParams = {}, queryParams = {}) => {
	try {
		route = compile(route, { encode: encodeURIComponent })(pathParams);
		let url = baseURL + route;
		if (!isEmpty(queryParams)) url += '?' + new URLSearchParams(queryParams).toString();
		const response = await axios.get(url, { headers });
		console.log('RESPONSE: ', JSON.stringify(response.data, null, 2));
		return response.data;
	} catch (err) {
		if (err.response) {
			console.log('Response Data: ', err.response.data);
			console.log('Response Status:', err.response.status);
			console.log('Response Headers', err.response.headers);
		} else if (err.request) console.log(err.request);
		else console.log('Error: ', err.message);
		console.log('Request CONFIG: ', err.config);
	}
};
