import {describe, it, expect, jest} from '@jest/globals';

import {AuthenticationRepository} from '#domains/authentications/authentication-repository.js';
import {NewAuth} from '#domains/authentications/entities/new-auth.js';
import {UserRepository} from '#domains/users/user-repository.js';
import {PasswordHash} from '#applications/security/password-hash.js';
import {AuthTokenManager} from '#applications/security/auth-token-manager.js';
import {LoginUser} from '../login-user.js';

/**
 * @template T
 * @typedef {import("@jest/globals").jest.MockedFunction<T>} MockedFunction
 */

describe('LoginUser usecase', () => {
	it('should orchestrate login user usecase correctly', async () => {
		const useCasePayload = {
			username: 'dicoding',
			password: 'secret',
		};
		const expectedAuthentication = new NewAuth({
			accessToken: 'access_token',
			refreshToken: 'refresh_token',
		});
		const mockUserRepository = new UserRepository();
		const mockAuthenticationRepository = new AuthenticationRepository();
		const mockAuthTokenManager = new AuthTokenManager();
		const mockPasswordHash = new PasswordHash();

		mockUserRepository.getPasswordByUsername
      = /** @type {MockedFunction<typeof mockUserRepository.getPasswordByUsername>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve('encrypted_password')));
		mockPasswordHash.compare
      = /** @type {MockedFunction<typeof mockPasswordHash.compare>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve()));
		mockAuthTokenManager.createAccessToken
      = /** @type {MockedFunction<typeof mockAuthTokenManager.createAccessToken>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve(expectedAuthentication.accessToken)));
		mockAuthTokenManager.createRefreshToken
      = /** @type {MockedFunction<typeof mockAuthTokenManager.createRefreshToken>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve(expectedAuthentication.refreshToken)));
		mockUserRepository.getIdByUsername
      = /** @type {MockedFunction<typeof mockUserRepository.getIdByUsername>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve('user-123')));
		mockAuthenticationRepository.addToken
      = /** @type {MockedFunction<typeof mockAuthenticationRepository.addToken>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve()));

		const loginUser = new LoginUser(
			mockUserRepository,
			mockAuthenticationRepository,
			mockAuthTokenManager,
			mockPasswordHash,
		);

		const actualAuthentication = await loginUser.execute(useCasePayload);

		expect(actualAuthentication).toEqual(expectedAuthentication);
		expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('dicoding');
		expect(mockPasswordHash.compare).toBeCalledWith('secret', 'encrypted_password');
		expect(mockAuthTokenManager.createAccessToken).toBeCalledWith({id: 'user-123', username: 'dicoding'});
		expect(mockAuthTokenManager.createRefreshToken).toBeCalledWith({id: 'user-123', username: 'dicoding'});
		expect(mockUserRepository.getIdByUsername).toBeCalledWith('dicoding');
		expect(mockAuthenticationRepository.addToken).toBeCalledWith(expectedAuthentication.refreshToken);
	});
});
