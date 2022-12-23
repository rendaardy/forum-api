import {describe, it, expect, jest} from '@jest/globals';

import {RegisterUser} from '#domains/users/entities/register-user.js';
import {RegisteredUser} from '#domains/users/entities/registered-user.js';
import {UserRepository} from '#domains/users/user-repository.js';
import {PasswordHash} from '#applications/security/password-hash.js';
import {AddUser} from '../add-user.js';

/**
 * @template T
 * @typedef {import("@jest/globals").jest.MockedFunction<T>} MockedFunction
 */

describe('AddUser usecase', () => {
	it('should orchestrate the add user action correctly', async () => {
		const useCasePayload = {
			username: 'dicoding',
			password: 'secret',
			fullname: 'Dicoding Indonesia',
		};
		const expectedRegisteredUser = new RegisteredUser({
			id: 'user-123',
			username: useCasePayload.username,
			fullname: useCasePayload.fullname,
		});

		const mockUserRepository = new UserRepository();
		const mockPasswordHash = new PasswordHash();

		mockUserRepository.verifyAvailableUsername
      = /** @type {MockedFunction<typeof mockUserRepository.verifyAvailableUsername>} */(jest.fn()
				.mockImplementation(() => Promise.resolve()));
		mockPasswordHash.hash
      = /** @type {MockedFunction<typeof mockPasswordHash.hash>} */(jest.fn()
				.mockImplementation(() => Promise.resolve('encrypted_password')));
		mockUserRepository.addUser
      = /** @type {MockedFunction<typeof mockUserRepository.addUser>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(expectedRegisteredUser)));

		const addUser = new AddUser(mockUserRepository, mockPasswordHash);

		const registeredUser = await addUser.execute(useCasePayload);

		expect(registeredUser).toStrictEqual(expectedRegisteredUser);
		expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
		expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
		expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
			username: useCasePayload.username,
			password: 'encrypted_password',
			fullname: useCasePayload.fullname,
		}));
	});
});
