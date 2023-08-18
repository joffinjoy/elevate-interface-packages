const elevateExceptions = require('./exceptions');
const { checkForMissingRoutes } = require('./utils/checkForMissingRoutes');
const { expectedRoutesValidator } = require('./utils/expectedRoutesValidator');

const packageValidator = (packages, allExpectedRoutes, meta) => {
	//expectedRoutesValidator(allExpectedRoutes);
	const fullErrorRoutesList = [];
	const fullWarnRoutesList = [];
	const packagesValidated = [];
	const { supportedHttpTypes } = meta;
	for (const packageData of packages) {
		const { basePackageName, packageName } = packageData.packageMeta;
		const packageRoutes = packageData.routes;
		if (!allExpectedRoutes[basePackageName])
			throw elevateExceptions.createUnknownBasePackageNameException({ invalidBasePackageName: basePackageName });
		const expectedRoutes = allExpectedRoutes[basePackageName];
		const { errorRoutesList, warnRoutesList } = checkForMissingRoutes(
			expectedRoutes,
			packageRoutes,
			basePackageName,
			packageName,
			supportedHttpTypes
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
