import {describe, it, expect, jest} from '@jest/globals';

import {AuthTokenManager} from '#applications/security/auth-token-manager.js';
import {AuthenticationRepository} from '#domains/authentications/authentication-repository.js';
import {RefreshAuth} from '../refresh-auth.js';

/**
 * @template T
 * @typedef {import("@jest/globals").jest.MockedFunction<T>} MockedFunction
 */

describe('RefreshAuth usecase', () => {
	it('should throw an error when the payload doesn\'t contain refresh token', async () => {
		const useCasePayload = {};
		const mockAuthenticationRepository = new AuthenticationRepository();
		const mockAuthTokenManager = new AuthTokenManager();
		const refreshAuth = new RefreshAuth(mockAuthenticationRepository, mockAuthTokenManager);

		await expect(refreshAuth.execute(useCasePayload)).rejects
			.toThrowError('REFRESH_AUTHENTICATION_USECASE.NOT_CONTAIN_REFRESH_TOKEN');
	});

	it('should throw an error if refresh token isn\'t of type string', async () => {
		const useCasePayload = {
			refreshToken: 1,
		};
		const mockAuthenticationRepository = new AuthenticationRepository();
		const mockAuthTokenManager = new AuthTokenManager();
		const refreshAuth = new RefreshAuth(mockAuthenticationRepository, mockAuthTokenManager);

		await expect(refreshAuth.execute(useCasePayload)).rejects
			.toThrowError('REFRESH_AUTHENTICATION_USECASE.TYPE_MISMATCH');
	});

	it('should orchestrate the refresh token usecase correctly', async () => {
		const useCasePayload = {
			refreshToken: 'refresh_token',
		};
		const mockAuthenticationRepository = new AuthenticationRepository();
		const mockAuthTokenManager = new AuthTokenManager();

		mockAuthTokenManager.verifyRefreshToken
      = /** @type {MockedFunction<typeof mockAuthTokenManager.verifyRefreshToken>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve()));
		mockAuthenticationRepository.checkTokenAvailability
      = /** @type {MockedFunction<typeof mockAuthenticationRepository.checkTokenAvailability>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve()));
		mockAuthTokenManager.decodePayload
      = /** @type {MockedFunction<typeof mockAuthTokenManager.decodePayload>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve({id: 'user-123', username: 'dicoding'})));
		mockAuthTokenManager.createAccessToken
      = /** @type {MockedFunction<typeof mockAuthTokenManager.createAccessToken>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve('new_access_token')));

		const refreshAuth = new RefreshAuth(mockAuthenticationRepository, mockAuthTokenManager);

		const accessToken = await refreshAuth.execute(useCasePayload);

		expect(accessToken).toEqual('new_access_token');
		expect(mockAuthTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
		expect(mockAuthenticationRepository.checkTokenAvailability).toBeCalledWith(useCasePayload.refreshToken);
		expect(mockAuthTokenManager.decodePayload).toBeCalledWith(useCasePayload.refreshToken);
		expect(mockAuthTokenManager.createAccessToken).toBeCalledWith({id: 'user-123', username: 'dicoding'});
	});
});
