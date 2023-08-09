const express = require('express');
const router = express.Router();

const getDependencies = () => {
	return ['kafka', 'kafka-connect', 'redis'];
};

/* user: {
    routes: {
        '/v1/get-user-photo': [{ type: 'GET', priority: 'MUST_HAVE' }],
        '/v1/get-user-profile': [{ type: 'POST', priority: 'MUST_HAVE' }],
        '/v1/get-sharelink': [
            { type: 'PUT', priority: 'MUST_HAVE' },
            { type: 'PATCH', priority: 'MUST_HAVE' },
        ],
        '/v1/get-user-details': [{ type: 'DELETE', priority: 'MUST_HAVE' }],
    },
}, */

const getRoutes = () => {
	return [
		{ route: '/v1/get-user-photo', info: [{ type: 'GET' }] },
		{ route: '/v1/get-user-profile', info: [{ type: 'POST' }] },
		//{ route: '/v1/get-sharelink', info: [{ type: 'PUT' }, { type: 'PATCH' }] },
		{ route: '/v1/get-user-details', info: [{ type: 'DELETE' }] },
	];
};

const getPackageMeta = () => {
	return {
		basePackageName: 'user',
		packageName: 'elevate-user',
	};
};

const createPackage = (options) => {
	return {
		router: () => {
			console.log('router');
		},
		endpoints: [],
		dependencies: [],
	};
};

router.get('/', (req, res) => {
	res.send('Hello, world! From package2');
});

module.exports = { dependencies: getDependencies(), routes: getRoutes(), createPackage, packageMeta: getPackageMeta() };
