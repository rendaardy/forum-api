import {describe, it, expect} from '@jest/globals';

import {InvariantError} from '../invariant-error.js';

describe('InvariantError', () => {
	it('should be instantiated correctly', () => {
		const invariantError = new InvariantError('an error occurs');

		expect(invariantError.statusCode).toEqual(400);
		expect(invariantError.message).toEqual('an error occurs');
		expect(invariantError.name).toEqual('InvariantError');
	});
});
