import {describe, it, expect} from '@jest/globals';

import {NewAuth} from '../new-auth.js';

describe('NewAuth entity', () => {
	it('should throw an error when the payload doesn\'t meet the required properties', () => {
		const payload = {
			accessToken: 'accessToken',
		};

		expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			accessToken: 'accessToken',
			refreshToken: 12345,
		};

		expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.TYPE_MISMATCH');
	});

	it('should instantiate NewAuth entity successfully', () => {
		const payload = {
			accessToken: 'accessToken',
			refreshToken: 'refreshToken',
		};

		const newAuth = new NewAuth(payload);

		expect(newAuth).toBeInstanceOf(NewAuth);
		expect(newAuth.accessToken).toEqual(payload.accessToken);
		expect(newAuth.refreshToken).toEqual(payload.refreshToken);
	});
});
