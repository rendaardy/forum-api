import {describe, it, expect} from '@jest/globals';

import {UserRepository} from '../user-repository.js';

describe('UserRepository interface', () => {
	it('should throw an error when calling interface method directly', async () => {
		const userRepository = new UserRepository();
		const registerUser = {
			username: 'dicoding',
			password: 'secret',
			fullname: 'Dicoding Indonesia',
		};

		await expect(userRepository.addUser(/** @type {any} */(registerUser)))
			.rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(userRepository.verifyAvailableUsername('dicoding'))
			.rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(userRepository.getPasswordByUsername('dicoding'))
			.rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(userRepository.getIdByUsername('dicoding'))
			.rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});
