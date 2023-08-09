const createError = (errorMessage, details) => {
	const error = new Error(errorMessage);
	error.details = details;
	return error;
};

const createRepeatedConfigurationException = ({ route, packageName, basePackageName }) => {
	return createError('Repeated configurations for the same route.', {
		errorCode: 'E001-001',
		route,
		packageName,
		basePackageName,
	});
};

const createUnknownPriorityException = ({ unknownPriority, basePackageName, route }) => {
	return createError('FATAL: Package validator configuration error on expected routes.', {
		errorCode: 'E001-002',
		route,
		basePackageName,
		unknownPriority,
	});
};

const createUnknownBasePackageNameException = ({ invalidBasePackageName }) => {
	return createError('Unknown base-package name', { errorCode: 'E001-003', invalidBasePackageName });
};

const createMustHaveRoutesMissingException = ({ missingRoutes }) => {
	return createError('One or more MUST_HAVE routes are missing', { errorCode: 'E001-004', missingRoutes });
};

const elevateExceptions = {
	createRepeatedConfigurationException,
	createUnknownPriorityException,
	createUnknownBasePackageNameException,
	createMustHaveRoutesMissingException,
};

module.exports = elevateExceptions;
