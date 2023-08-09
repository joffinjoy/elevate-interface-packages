const { routes } = require('./routes');

const getRouteMap = (packageRoutes) => {
	const routeMap = new Map();
	for (const routeObject of packageRoutes) {
		if (routeMap.has(routeObject.route))
			throw `[Error][e004] Repeated configurations for the same route: ${routeObject.route}`;
		routeMap.set(routeObject.route, new Set(routeObject.info.map((typeObject) => typeObject.type)));
	}
	return routeMap;
};

const checkForMissingRoutes = (expectedRoutes, packageRoutes, basePackageName, packageName) => {
	const errorRoutesList = [];
	const warnRoutesList = [];
	const routeMap = getRouteMap(packageRoutes);
	for (const expectedRoute of Object.keys(expectedRoutes)) {
		for (const typeObject of expectedRoutes[expectedRoute]) {
			const { type, priority } = typeObject;
			if (!routeMap.has(expectedRoute) || !routeMap.get(expectedRoute).has(type)) {
				const route = { basePackageName, packageName, route: expectedRoute, type };
				if (priority == 'MUST_HAVE') errorRoutesList.push(route);
				else if (priority == 'OPTIONAL') warnRoutesList.push(route);
				else
					throw `[Error][e005] FATAL: Package validator configuration error on expected routes. Unknown Priority: ${priority}`;
			}
		}
	}
	return { errorRoutesList, warnRoutesList };
};

const packageValidator = (packages) => {
	const fullErrorRoutesList = [];
	const fullWarnRoutesList = [];
	for (const packageData of packages) {
		const { basePackageName, packageName } = packageData.packageMeta;
		const packageRoutes = packageData.routes;
		if (!routes[basePackageName]) throw `[Error][e001] Unknown base-package name: ${basePackageName}`;
		const expectedRoutes = routes[basePackageName].routes;
		const { errorRoutesList, warnRoutesList } = checkForMissingRoutes(
			expectedRoutes,
			packageRoutes,
			basePackageName,
			packageName
		);
		fullErrorRoutesList.push(...errorRoutesList);
		fullWarnRoutesList.push(...warnRoutesList);
	}

	if (fullWarnRoutesList.length > 0) {
		console.log('\n\n[WARN][w001] One or more OPTIONAL route are missing.');
		console.table(fullWarnRoutesList);
	}
	if (fullErrorRoutesList.length > 0) {
		console.log('\n\n[ERROR][e002] One or more MUST_HAVE routes are missing.');
		console.table(fullErrorRoutesList);
		throw `[Error][e002] One or more MUST_HAVE routes are missing. \nMissing Routes:${JSON.stringify(
			fullErrorRoutesList,
			undefined,
			4
		)}`;
	}
	return true;
};

const elevateValidator = {
	packageValidator,
};

module.exports = elevateValidator;
