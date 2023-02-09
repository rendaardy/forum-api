import {describe, it, expect, afterEach, afterAll} from '@jest/globals';

import {UsersTableTestHelper} from '#tests/users-table-test-helper.ts';
import {InvariantError} from '#commons/exceptions/invariant-error.ts';
import {RegisterUser} from '#domains/users/entities/register-user.ts';
import {RegisteredUser} from '#domains/users/entities/registered-user.ts';
import {pool} from '#infrastructures/database/postgres/pool.ts';
import {UserRepositoryPostgres} from '../user-repository-postgres.ts';

describe('UserRepositoryPostgres', () => {
	afterEach(async () => {
		await UsersTableTestHelper.clearTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('verifyAvailableUsername method', () => {
		it('should throw InvariantError when username isn\'t available', async () => {
			await UsersTableTestHelper.addUser({username: 'dicoding'});

			const repository = new UserRepositoryPostgres(pool, () => '123');

			await expect(repository.verifyAvailableUsername('dicoding')).rejects.toThrowError(InvariantError);
		});

		it('shouldn\'t throw InvariantError when username is available', async () => {
			const repository = new UserRepositoryPostgres(pool, () => '123');

			await expect(repository.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(InvariantError);
		});
	});

	describe('addUser method', () => {
		it('should store register user to DB', async () => {
			const registerUser = new RegisterUser({
				username: 'dicoding',
				password: 'secret_password',
				fullname: 'Dicoding Indonesia',
			});
			const fakeIdGenerator = () => '123';
			const fakeRepository = new UserRepositoryPostgres(pool, fakeIdGenerator);

			await fakeRepository.addUser(registerUser);

			const users = await UsersTableTestHelper.findUsersById('user-123');
			expect(users).toHaveLength(1);
		});

		it('should return registered user', async () => {
			const registerUser = new RegisterUser({
				username: 'dicoding',
				password: 'secret_password',
				fullname: 'Dicoding Indonesia',
			});
			const fakeIdGenerator = () => '123';
			const fakeRepository = new UserRepositoryPostgres(pool, fakeIdGenerator);

			const registeredUser = await fakeRepository.addUser(registerUser);

			expect(registeredUser).toStrictEqual(new RegisteredUser({
				id: 'user-123',
				username: 'dicoding',
				fullname: 'Dicoding Indonesia',
			}));
		});
	});

	describe('getPasswordByUsername method', () => {
		it('should throw InvariantError when username isn\'t found', async () => {
			const fakeRepository = new UserRepositoryPostgres(pool, () => '');

			await expect(fakeRepository.getPasswordByUsername('dicoding')).rejects
				.toThrowError(InvariantError);
		});

		it('should return user\'s password when username is found', async () => {
			await UsersTableTestHelper.addUser({username: 'dicoding', password: 'secret'});

			const fakeRepository = new UserRepositoryPostgres(pool, () => '');

			const password = await fakeRepository.getPasswordByUsername('dicoding');

			expect(password).toEqual('secret');
		});
	});

	describe('getIdByUsername method', () => {
		it('should throw InvariantError when username isn\'t found', async () => {
			const fakeRepository = new UserRepositoryPostgres(pool, () => '');

			await expect(fakeRepository.getIdByUsername('dicoding')).rejects
				.toThrowError(InvariantError);
		});

		it('should return user\'s id when username is found', async () => {
			await UsersTableTestHelper.addUser({id: 'user-123', username: 'dicoding'});

			const fakeRepository = new UserRepositoryPostgres(pool, () => '123');

			const userId = await fakeRepository.getIdByUsername('dicoding');

			expect(userId).toEqual('user-123');
		});
	});
});
