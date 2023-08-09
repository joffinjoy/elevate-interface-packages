const routes = {
	/* mentoring: {
		routes: {
			'/v1/get-sessions': { priority: 'MUST_HAVE', type: 'POST' },
			'/v1/get-joinlink': { priority: 'OPTIONAL', type: 'GET' },
		},
	}, */
	user: {
		routes: {
			'/v1/get-user-photo': [{ type: 'GET', priority: 'MUST_HAVE' }],
			'/v1/get-user-profile': [{ type: 'POST', priority: 'MUST_HAVE' }],
			'/v1/get-sharelink': [
				{ type: 'PUT', priority: 'MUST_HAVE' },
				{ type: 'PATCH', priority: 'OPTIONAL' },
			],
			'/v1/get-user-details': [{ type: 'DELETE', priority: 'MUST_HAVE' }],
		},
	},
};

module.exports = { routes };
