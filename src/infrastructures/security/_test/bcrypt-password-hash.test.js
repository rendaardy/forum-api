import {describe, it, expect, jest} from '@jest/globals';
import bcrypt from 'bcrypt';

import {AuthenticationError} from '#commons/exceptions/authentication-error.js';
import {BcryptPasswordHash} from '../bcrypt-password-hash.js';

describe('BcryptPasswordHash', () => {
	describe('hash method', () => {
		it('should encrypt password correctly', async () => {
			const spyHash = jest.spyOn(bcrypt, 'hash');
			const passwordHash = new BcryptPasswordHash(bcrypt);

			const encryptedPassword = await passwordHash.hash('plain_password');

			expect(typeof encryptedPassword).toEqual('string');
			expect(encryptedPassword).not.toEqual('plain_password');
			expect(spyHash).toBeCalledWith('plain_password', 10);
		});
	});

	describe('compare method', () => {
		it('should throw AuthenticationError when the password doesn\'t match', async () => {
			const passwordHash = new BcryptPasswordHash(bcrypt);

			await expect(passwordHash.compare('plain_password', 'encrypted_password')).rejects
				.toThrowError(AuthenticationError);
		});

		it('shouldn\'t throw AuthenticationError when the password does match', async () => {
			const passwordHash = new BcryptPasswordHash(bcrypt);
			const plainPassword = 'plain_password';
			const encryptedPassword = await passwordHash.hash(plainPassword);

			await expect(passwordHash.compare(plainPassword, encryptedPassword)).resolves.not
				.toThrowError(AuthenticationError);
		});
	});
});
