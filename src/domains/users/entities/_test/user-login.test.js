import {describe, it, expect} from '@jest/globals';

import {UserLogin} from '../user-login.js';

describe('UserLogin entity', () => {
	it('should throw an error when the payload doesn\'t meet the required properties', () => {
		const payload = {
			username: 'dicoding',
		};

		expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			username: 'dicoding',
			password: 12345,
		};

		expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.TYPE_MISMATCH');
	});

	it('should instantiate UserLogin entity successfully', () => {
		const payload = {
			username: 'dicoding',
			password: '12345',
		};

		const userLogin = new UserLogin(payload);

		expect(userLogin).toBeInstanceOf(UserLogin);
		expect(userLogin.username).toEqual(payload.username);
		expect(userLogin.password).toEqual(payload.password);
	});
});
