import {describe, it, expect} from '@jest/globals';

import {AuthorizationError} from '../authorization-error.ts';
import {ClientError} from '../client-error.ts';

describe('AuthorizationError', () => {
	it('should create AuthorizationError successfully', () => {
		const authorizationError = new AuthorizationError('authorization error!');

		expect(authorizationError).toBeInstanceOf(AuthorizationError);
		expect(authorizationError).toBeInstanceOf(ClientError);
		expect(authorizationError).toBeInstanceOf(Error);

		expect(authorizationError.statusCode).toEqual(403);
		expect(authorizationError.message).toEqual('authorization error!');
		expect(authorizationError.name).toEqual('AuthorizationError');
	});
});
