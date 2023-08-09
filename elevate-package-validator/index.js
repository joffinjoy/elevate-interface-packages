const { routes } = require('./routes');
const elevateExceptions = require('./exceptions');
const supportedHttpTypes = require('./supportHttpTypes');

const getRouteMap = (packageRoutes, basePackageName, packageName) => {
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
				routeObject.info.map((typeObject) => {
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

const checkForMissingRoutes = (expectedRoutes, packageRoutes, basePackageName, packageName) => {
	const errorRoutesList = [];
	const warnRoutesList = [];
	const routeMap = getRouteMap(packageRoutes, basePackageName, packageName);
	for (const expectedRoute of Object.keys(expectedRoutes)) {
		for (const typeObject of expectedRoutes[expectedRoute]) {
			const { type, priority } = typeObject;
			if (!routeMap.has(expectedRoute) || !routeMap.get(expectedRoute).has(type)) {
				const route = { basePackageName, packageName, route: expectedRoute, type, priority };
				if (priority == 'MUST_HAVE') errorRoutesList.push(route);
				else if (priority == 'OPTIONAL') warnRoutesList.push(route);
				else
					throw elevateExceptions.createUnknownPriorityException({
						unknownPriority: priority,
						basePackageName,
						route: expectedRoute,
					});
			}
		}
	}
	return { errorRoutesList, warnRoutesList };
};

const packageValidator = (packages) => {
	const fullErrorRoutesList = [];
	const fullWarnRoutesList = [];
	const packagesValidated = [];
	for (const packageData of packages) {
		const { basePackageName, packageName } = packageData.packageMeta;
		const packageRoutes = packageData.routes;
		if (!routes[basePackageName])
			throw elevateExceptions.createUnknownBasePackageNameException({ invalidBasePackageName: basePackageName });
		const expectedRoutes = routes[basePackageName].routes;
		const { errorRoutesList, warnRoutesList } = checkForMissingRoutes(
			expectedRoutes,
			packageRoutes,
			basePackageName,
			packageName
		);
		fullErrorRoutesList.push(...errorRoutesList);
		fullWarnRoutesList.push(...warnRoutesList);
		packagesValidated.push({ basePackageName, packageName });
	}

	if (fullWarnRoutesList.length > 0) {
		console.log('\n\nOne or more OPTIONAL routes are missing:');
		console.table(fullWarnRoutesList);
	}
	if (fullErrorRoutesList.length > 0) {
		console.log('\n\nOne or more MUST_HAVE routes are missing:');
		console.table(fullErrorRoutesList);
		throw elevateExceptions.createMustHaveRoutesMissingException({ missingRoutes: fullErrorRoutesList });
	}
	return {
		success: true,
		optionalRoutesMissing: fullWarnRoutesList,
		packageCount: packages.length,
		packagesValidated,
	};
};

const elevateValidator = {
	packageValidator,
};

module.exports = elevateValidator;
