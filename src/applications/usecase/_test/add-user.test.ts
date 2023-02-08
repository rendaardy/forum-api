import {describe, it, expect, jest} from '@jest/globals';

import {RegisterUser} from '#domains/users/entities/register-user.ts';
import {RegisteredUser} from '#domains/users/entities/registered-user.ts';
import {UserRepository} from '#domains/users/user-repository.ts';
import {PasswordHash} from '#applications/security/password-hash.ts';
import {AddUser} from '../add-user.ts';

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

		mockUserRepository.verifyAvailableUsername = jest
			.fn<typeof mockUserRepository.verifyAvailableUsername>()
			.mockImplementation(async () => Promise.resolve());
		mockPasswordHash.hash = jest.fn<typeof mockPasswordHash.hash>()
			.mockImplementation(async () => Promise.resolve('encrypted_password'));
		mockUserRepository.addUser = jest.fn<typeof mockUserRepository.addUser>()
			.mockImplementation(async () => Promise.resolve(new RegisteredUser({
				id: 'user-123',
				username: useCasePayload.username,
				fullname: useCasePayload.fullname,
			})));

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
