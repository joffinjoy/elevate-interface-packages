const { getRouteMap } = require('./getRouteMap');
const elevateExceptions = require('../exceptions');

exports.checkForMissingRoutes = (expectedRoutes, packageRoutes, basePackageName, packageName, supportedHttpTypes) => {
	const errorRoutesList = [];
	const warnRoutesList = [];
	const routeMap = getRouteMap(packageRoutes, basePackageName, packageName, supportedHttpTypes);
	for (const routeObject of expectedRoutes) {
		const route = routeObject.route;
		for (const configObject of routeObject.config) {
			const { type, priority } = configObject;
			if (!routeMap.has(route) || !routeMap.get(route).has(type)) {
				const errorRouteObject = { basePackageName, packageName, route, type, priority };
				if (priority == 'MUST_HAVE') errorRoutesList.push(errorRouteObject);
				else if (priority == 'OPTIONAL') warnRoutesList.push(errorRouteObject);
				else
					throw elevateExceptions.createUnknownPriorityException({
						unknownPriority: priority,
						basePackageName,
						route: route,
					});
			}
		}
	}
	return { errorRoutesList, warnRoutesList };
};
