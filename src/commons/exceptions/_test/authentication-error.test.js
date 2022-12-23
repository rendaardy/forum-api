import {describe, it, expect} from '@jest/globals';

import {AuthenticationError} from '../authentication-error.js';

describe('AuthenticationError', () => {
	it('should be instantiated correctly', () => {
		const authenticationError = new AuthenticationError('authentication error!');

		expect(authenticationError.statusCode).toEqual(401);
		expect(authenticationError.message).toEqual('authentication error!');
		expect(authenticationError.name).toEqual('AuthenticationError');
	});
});
