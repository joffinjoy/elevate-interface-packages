module.exports = [
	{ route: '/v1/get-user-photo', config: [{ type: 'GET' }] },
	//{ route: '/v1/get-user-profile', config: [{ type: 'POST' }] },
	{ route: '/v1/get-sharelink', config: [{ type: 'PUT' }, { type: 'PATCH' }] },
	{ route: '/v1/get-user-details', config: [{ type: 'DELETE' }] },
];
