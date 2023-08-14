const elevateExceptions = require('../exceptions');

exports.getRouteMap = (packageRoutes, basePackageName, packageName, supportedHttpTypes) => {
	const routeMap = new Map();
	for (const routeObject of packageRoutes) {
		if (routeMap.has(routeObject.route))
			throw elevateExceptions.createRepeatedConfigurationException({
				route: routeObject.route,
				basePackageName,
				packageName,
			});
		routeMap.set(
			routeObject.route,
			new Set(
				routeObject.config.map((typeObject) => {
					if (!supportedHttpTypes.includes(typeObject.type))
						throw elevateExceptions.createUnsupportedHttpTypeException({
							unsupportedType: typeObject.type,
							basePackageName,
							route: routeObject.route,
							packageName,
						});
					return typeObject.type;
				})
			)
		);
	}
	return routeMap;
};
