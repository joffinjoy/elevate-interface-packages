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

const createUnsupportedHttpTypeException = ({ unsupportedType, route, basePackageName, packageName }) => {
	return createError('Unsupported Http Type', {
		errorCode: 'E001-005',
		unsupportedType,
		route,
		basePackageName,
		packageName,
	});
};

const createInvalidExpectedRoutesException = () => {
	return createError('Expected routes object must be a non-null object.', {
		errorCode: 'E001-006',
	});
};

const createEmptyRoutesArrayException = (basePackageName) => {
	return createError(`Routes array for base package '${basePackageName}' must not be empty.`, {
		errorCode: 'E001-007',
		basePackageName,
	});
};

const createInvalidRouteObjectException = (basePackageName) => {
	return createError(
		`Invalid route object in base package '${basePackageName}'. Each route object must have 'route' and a non-empty 'config' array.`,
		{
			errorCode: 'E001-008',
			basePackageName,
		}
	);
};

const createMissingTypeOrPriorityException = (basePackageName, route) => {
	return createError(
		`Invalid config object in base package '${basePackageName}' route '${route}'. Each config object must have 'type' and 'priority' properties.`,
		{
			errorCode: 'E001-009',
			basePackageName,
			route,
		}
	);
};

const elevateExceptions = {
	createRepeatedConfigurationException,
	createUnknownPriorityException,
	createUnknownBasePackageNameException,
	createMustHaveRoutesMissingException,
	createUnsupportedHttpTypeException,

	createInvalidExpectedRoutesException,
	createEmptyRoutesArrayException,
	createInvalidRouteObjectException,
	createMissingTypeOrPriorityException,
};

module.exports = elevateExceptions;
