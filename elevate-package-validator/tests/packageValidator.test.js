const elevateValidator = require('../index');
const elevateExceptions = require('../exceptions');

const packages = [
	{
		packageMeta: { basePackageName: 'test', packageName: 'elevate-test' },
		routes: [
			{ route: '/test-route-one', config: [{ type: 'GET' }] },
			{ route: '/test-route-two', config: [{ type: 'POST' }] },
		],
	},
];

const allExpectedRoutes = {
	test: [
		{ route: '/test-route-one', config: [{ type: 'GET', priority: 'MUST_HAVE' }] },
		{ route: '/test-route-two', config: [{ type: 'POST', priority: 'OPTIONAL' }] },
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
				packageMeta: { basePackageName: 'test', packageName: 'elevate-test' },
				routes: [{ route: '/test-route-one', config: [{ type: 'GET' }] }],
			},
		];
		const result = elevateValidator.packageValidator(missingOptionalRoutesPackages, allExpectedRoutes, meta);
		expect(result.success).toBe(true);
		expect(result.optionalRoutesMissing).toHaveLength(1);
		expect(result.optionalRoutesMissing[0]).toEqual({
			basePackageName: 'test',
			packageName: 'elevate-test',
			route: '/test-route-two',
			type: 'POST',
			priority: 'OPTIONAL',
		});
		expect(result.packageCount).toBe(1);
		expect(result.packagesValidated).toEqual([{ basePackageName: 'test', packageName: 'elevate-test' }]);
	});

	test('Invalid Base Package Name', () => {
		const invalidPackages = [
			{
				packageMeta: { basePackageName: 'invalidBase', packageName: 'elevate-test' },
				routes: [{ route: '/test-route-one', config: [{ type: 'GET' }] }],
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
				packageMeta: { basePackageName: 'test', packageName: 'elevate-test' },
				routes: [{ route: '/test-route-two', config: [{ type: 'POST' }] }],
			},
		];
		expect(() => elevateValidator.packageValidator(missingRoutePackages, allExpectedRoutes, meta)).toThrow(
			elevateExceptions.createMustHaveRoutesMissingException({
				missingRoutes: [
					{
						basePackageName: 'test',
						packageName: 'elevate-test',
						route: '/test-route-one',
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
			test: [{ route: '/test-route-three', config: [{ type: 'GET', priority: 'INVALID_PRIORITY' }] }],
		};
		expect(() => elevateValidator.packageValidator(packages, invalidRoutes, meta)).toThrow(
			elevateExceptions.createUnknownPriorityException({
				unknownPriority: 'INVALID_PRIORITY',
				basePackageName: 'test',
				route: '/test-route-one',
			})
		);
		try {
			elevateValidator.packageValidator(packages, invalidRoutes, meta);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-002');
		}
	});
});
