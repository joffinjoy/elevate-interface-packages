const elevateValidator = require('../index');
const elevateExceptions = require('../exceptions');

const basePackageName = 'test';
const packageName = 'elevate-test';
const routeOne = '/test-route-one';
const routeTwo = '/test-route-two';
const routeThree = '/test-route-three';

const packages = [
	{
		packageMeta: { basePackageName, packageName },
		routes: [
			{ route: routeOne, config: [{ type: 'GET' }] },
			{ route: routeTwo, config: [{ type: 'POST' }] },
		],
	},
];

const allExpectedRoutes = {
	test: [
		{ route: routeOne, config: [{ type: 'GET', priority: 'MUST_HAVE' }] },
		{ route: routeTwo, config: [{ type: 'POST', priority: 'OPTIONAL' }] },
	],
};

const meta = { supportedHttpTypes: ['GET', 'POST'] };

describe('Package Validator', () => {
	test('Valid Packages - No missing routes', () => {
		const result = elevateValidator.packageValidator(packages, allExpectedRoutes, meta);
		expect(result.success).toBe(true);
		expect(result.optionalRoutesMissing).toHaveLength(0);
		expect(result.packageCount).toBe(packages.length);
		expect(result.packagesValidated).toEqual(packages.map((p) => p.packageMeta));
	});

	test('No Missing Must-Have Routes, Some Optional Routes Missing', () => {
		const missingOptionalRoutesPackages = [
			{
				packageMeta: { basePackageName, packageName },
				routes: [{ route: routeOne, config: [{ type: 'GET' }] }],
			},
		];
		const result = elevateValidator.packageValidator(missingOptionalRoutesPackages, allExpectedRoutes, meta);
		expect(result.success).toBe(true);
		expect(result.optionalRoutesMissing).toHaveLength(1);
		expect(result.optionalRoutesMissing[0]).toEqual({
			basePackageName,
			packageName,
			route: routeTwo,
			type: 'POST',
			priority: 'OPTIONAL',
		});
		expect(result.packageCount).toBe(1);
		expect(result.packagesValidated).toEqual([{ basePackageName, packageName }]);
	});

	test('Invalid Base Package Name', () => {
		const invalidPackages = [
			{
				packageMeta: { basePackageName: 'invalidBase', packageName },
				routes: [{ route: routeOne, config: [{ type: 'GET' }] }],
			},
		];
		expect(() => elevateValidator.packageValidator(invalidPackages, allExpectedRoutes, meta)).toThrow(
			elevateExceptions.createUnknownBasePackageNameException({ invalidBasePackageName: 'invalidBase' })
		);
		try {
			elevateValidator.packageValidator(invalidPackages, allExpectedRoutes, meta);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-003');
		}
	});

	test('Missing Must-Have Route', () => {
		const missingRoutePackages = [
			{
				packageMeta: { basePackageName, packageName },
				routes: [{ route: routeTwo, config: [{ type: 'POST' }] }],
			},
		];
		expect(() => elevateValidator.packageValidator(missingRoutePackages, allExpectedRoutes, meta)).toThrow(
			elevateExceptions.createMustHaveRoutesMissingException({
				missingRoutes: [
					{
						basePackageName,
						packageName,
						route: routeOne,
						type: 'GET',
						priority: 'MUST_HAVE',
					},
				],
			})
		);
		try {
			elevateValidator.packageValidator(missingRoutePackages, allExpectedRoutes, meta);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-004');
		}
	});

	test('Unknown Priority Exception', () => {
		const invalidRoutes = {
			test: [{ route: routeThree, config: [{ type: 'GET', priority: 'INVALID_PRIORITY' }] }],
		};
		expect(() => elevateValidator.packageValidator(packages, invalidRoutes, meta)).toThrow(
			elevateExceptions.createUnknownPriorityException({
				unknownPriority: 'INVALID_PRIORITY',
				basePackageName,
				route: routeThree,
			})
		);
		try {
			elevateValidator.packageValidator(packages, invalidRoutes, meta);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-002');
		}
	});

	test('Repeated Configuration Exception', () => {
		const repeatedRoutes = [
			{
				packageMeta: { basePackageName, packageName },
				routes: [
					{ route: '/test-route', config: [{ type: 'GET' }] },
					{ route: '/test-route', config: [{ type: 'POST' }] },
				],
			},
		];

		expect(() => elevateValidator.packageValidator(repeatedRoutes, allExpectedRoutes, meta)).toThrow(
			elevateExceptions.createRepeatedConfigurationException({
				route: '/test-route',
				basePackageName,
				packageName,
			})
		);

		try {
			elevateValidator.packageValidator(repeatedRoutes, allExpectedRoutes, meta);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-001');
		}
	});

	test('Unsupported HTTP Type Exception', () => {
		const invalidRoutes = [
			{
				packageMeta: { basePackageName, packageName },
				routes: [{ route: routeOne, config: [{ type: 'PUT' }] }],
			},
		];

		expect(() => elevateValidator.packageValidator(invalidRoutes, allExpectedRoutes, meta)).toThrow(
			elevateExceptions.createUnsupportedHttpTypeException({
				unsupportedType: 'PUT',
				basePackageName,
				packageName,
				route: routeOne,
			})
		);

		try {
			elevateValidator.packageValidator(invalidRoutes, allExpectedRoutes, meta);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-005');
		}
	});
});
