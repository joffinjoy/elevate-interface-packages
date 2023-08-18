const express = require('express');
const routes = require('./constants/routes');

const getDependencies = () => {
	return ['kafka', 'kafka-connect', 'redis'];
};

const getPackageMeta = () => {
	return {
		basePackageName: 'mentoring',
		packageName: 'elevate-mentoring',
	};
};

const createPackage = (options) => {
	const { kafkaClient, redisClient } = options;

	console.log('Package 1 Called');

	const sendNotification = (message) => {
		kafkaClient.send(message);
	};

	const cacheSave = (key, value) => {
		redisClient.cacheIt(key, value);
	};

	const router = express.Router();
	router.get('/', (req, res) => {
		res.send('Hello, world! From package1');
		sendNotification('SENDING NOTIFICATION FROM PACKAGE 1 CONTROLLER');
		cacheSave('ALPHA KEY', 'ALPHA ');
	});

	return {
		sendNotification,
		cacheSave,
		router,
	};
};

module.exports = { dependencies: getDependencies(), routes, createPackage, packageMeta: getPackageMeta() };
