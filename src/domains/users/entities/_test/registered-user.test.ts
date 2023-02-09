import {describe, it, expect} from '@jest/globals';

import {RegisteredUser} from '../registered-user.ts';

describe('A RegisteredUser entity', () => {
	it('should throw an error when the payload doesn\'t meet the required properties', () => {
		const payload = {
			username: 'dicoding',
			fullname: 'Dicoding Indonesia',
		};

		expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			id: 123,
			username: 'dicoding',
			fullname: 'Dicoding Indonesia',
		};

		expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.TYPE_MISMATCH');
	});

	it('should create RegisteredUser object successfully', () => {
		const payload = {
			id: 'user-123',
			username: 'dicoding',
			fullname: 'Dicoding Indonesia',
		};

		const {id, username, fullname} = new RegisteredUser(payload);

		expect(id).toEqual(payload.id);
		expect(username).toEqual(payload.username);
		expect(fullname).toEqual(payload.fullname);
	});
});
