const elevateExceptions = require('../exceptions');

exports.expectedRoutesValidator = (expectedRoutes) => {
	if (typeof expectedRoutes !== 'object' || expectedRoutes === null)
		throw elevateExceptions.createInvalidExpectedRoutesException();

	for (const basePackageName in expectedRoutes) {
		if (!expectedRoutes.hasOwnProperty(basePackageName)) continue;

		const routes = expectedRoutes[basePackageName];
		if (!Array.isArray(routes) || routes.length === 0)
			throw elevateExceptions.createEmptyRoutesArrayException(basePackageName);

		for (const routeObject of routes) {
			if (
				typeof routeObject !== 'object' ||
				!routeObject.route ||
				!Array.isArray(routeObject.config) ||
				routeObject.config.length === 0
			) {
				throw elevateExceptions.createInvalidRouteObjectException(basePackageName);
			}

			for (const configObject of routeObject.config) {
				if (typeof configObject !== 'object' || !configObject.type || !configObject.priority) {
					throw elevateExceptions.createMissingTypeOrPriorityException(basePackageName, routeObject.route);
				}
			}
		}
	}
};
