import {describe, it, expect, jest} from '@jest/globals';

import {AuthenticationRepository} from '#domains/authentications/authentication-repository.ts';
import {NewAuth} from '#domains/authentications/entities/new-auth.ts';
import {UserRepository} from '#domains/users/user-repository.ts';
import {PasswordHash} from '#applications/security/password-hash.ts';
import {AuthTokenManager} from '#applications/security/auth-token-manager.ts';
import {LoginUser} from '../login-user.ts';

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

		mockUserRepository.getPasswordByUsername = jest
			.fn<typeof mockUserRepository.getPasswordByUsername>()
			.mockImplementation(async () => Promise.resolve('encrypted_password'));
		mockPasswordHash.compare = jest.fn<typeof mockPasswordHash.compare>()
			.mockImplementation(async () => Promise.resolve());
		mockAuthTokenManager.createAccessToken = jest
			.fn<typeof mockAuthTokenManager.createAccessToken>()
			.mockImplementation(async () => Promise.resolve('access_token'));
		mockAuthTokenManager.createRefreshToken = jest
			.fn<typeof mockAuthTokenManager.createRefreshToken>()
			.mockImplementation(async () => Promise.resolve('refresh_token'));
		mockUserRepository.getIdByUsername = jest.fn<typeof mockUserRepository.getIdByUsername>()
			.mockImplementation(async () => Promise.resolve('user-123'));
		mockAuthenticationRepository.addToken = jest
			.fn<typeof mockAuthenticationRepository.addToken>()
			.mockImplementation(async () => Promise.resolve());

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
