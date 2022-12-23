import {describe, it, expect} from '@jest/globals';

import {RegisterUser} from '../register-user.js';

describe('A RegisterUser entity', () => {
	it('should throw an error when the payload doesn\'t meet the required properties', () => {
		const payload = {
			username: 'abc',
			password: 'abc',
		};

		expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			username: 123,
			password: true,
			fullname: 'abc',
		};

		expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.TYPE_MISMATCH');
	});

	it('should throw an error when username has 50 length characters', () => {
		const payload = {
			username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
			fullname: 'Dicoding Indonesia',
			password: 'abc',
		};

		expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_LIMIT_CHAR');
	});

	it('should throw an error when username contains forbidden characters', () => {
		const payload = {
			username: 'dico ding',
			password: 'secret',
			fullname: 'Dicoding Indonesia',
		};

		expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_CONTAIN_FORBIDDEN_CHARACTER');
	});

	it('should create RegisterUser object successfully', () => {
		const payload = {
			username: 'dicoding',
			password: 'secret',
			fullname: 'Dicoding Indonesia',
		};

		const {username, password, fullname} = new RegisterUser(payload);

		expect(username).toEqual(payload.username);
		expect(password).toEqual(payload.password);
		expect(fullname).toEqual(payload.fullname);
	});
});
