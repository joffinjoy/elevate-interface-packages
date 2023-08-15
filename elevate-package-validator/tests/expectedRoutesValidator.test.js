const { expectedRoutesValidator } = require('../utils/expectedRoutesValidator');
const elevateExceptions = require('../exceptions');

describe('Expected Routes Validator', () => {
	test('Invalid Expected Routes Exception', () => {
		const invalidExpectedRoutes = 'invalidRoutes';
		expect(() => expectedRoutesValidator(invalidExpectedRoutes)).toThrow(
			elevateExceptions.createInvalidExpectedRoutesException()
		);
		try {
			expectedRoutesValidator(invalidExpectedRoutes);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-006');
		}
	});

	test('Empty Routes Array Exception', () => {
		const invalidExpectedRoutes = {
			test: [],
		};
		expect(() => expectedRoutesValidator(invalidExpectedRoutes)).toThrow(
			elevateExceptions.createEmptyRoutesArrayException('test')
		);
		try {
			expectedRoutesValidator(invalidExpectedRoutes);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-007');
		}
	});

	test('Invalid Route Object Exception (Empty Config Array)', () => {
		const invalidExpectedRoutes = {
			test: [{ route: '/test-route', config: [] }],
		};
		expect(() => expectedRoutesValidator(invalidExpectedRoutes)).toThrow(
			elevateExceptions.createInvalidRouteObjectException('test')
		);
		try {
			expectedRoutesValidator(invalidExpectedRoutes);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-008');
		}
	});

	test('Invalid Route Object Exception (Missing Route)', () => {
		const invalidExpectedRoutes = {
			test: [{ config: [{ type: 'PUT', priority: 'MUST_HAVE' }] }],
		};
		expect(() => expectedRoutesValidator(invalidExpectedRoutes)).toThrow(
			elevateExceptions.createInvalidRouteObjectException('test')
		);
		try {
			expectedRoutesValidator(invalidExpectedRoutes);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-008');
		}
	});

	test('Missing Type In Config Object', () => {
		const invalidExpectedRoutes = {
			test: [{ route: '/test-route', config: [{ priority: 'MUST_HAVE' }] }],
		};
		expect(() => expectedRoutesValidator(invalidExpectedRoutes)).toThrow(
			elevateExceptions.createMissingTypeOrPriorityException('test', '/test-route')
		);
		try {
			expectedRoutesValidator(invalidExpectedRoutes);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-009');
		}
	});

	test('Missing Priority In Config Object', () => {
		const invalidExpectedRoutes = {
			test: [{ route: '/test-route', config: [{ type: 'PUT' }] }],
		};
		expect(() => expectedRoutesValidator(invalidExpectedRoutes)).toThrow(
			elevateExceptions.createMissingTypeOrPriorityException('test', '/test-route')
		);
		try {
			expectedRoutesValidator(invalidExpectedRoutes);
		} catch (error) {
			expect(error.details.errorCode).toBe('E001-009');
		}
	});
});
