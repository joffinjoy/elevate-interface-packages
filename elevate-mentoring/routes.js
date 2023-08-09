module.exports = [
	{ route: '/v1/get-user-photo', info: [{ type: 'GET' }] },
	{ route: '/v1/get-user-profile', info: [{ type: 'POST' }] },
	{ route: '/v1/get-sharelink', info: [{ type: 'PUT' }, { type: 'PATCH' }] },
	{ route: '/v1/get-user-details', info: [{ type: 'DELETE' }] },
];
