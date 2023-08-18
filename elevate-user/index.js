const express = require('express');
const router = express.Router();
const routes = require('./constants/routes');

const getDependencies = () => {
	return ['kafka', 'kafka-connect', 'redis'];
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

module.exports = { dependencies: getDependencies(), routes, createPackage, packageMeta: getPackageMeta() };
