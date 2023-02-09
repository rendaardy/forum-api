import {describe, it, expect, jest} from '@jest/globals';

import {AuthTokenManager} from '#applications/security/auth-token-manager.ts';
import {AuthenticationRepository} from '#domains/authentications/authentication-repository.ts';
import {RefreshAuth} from '../refresh-auth.ts';

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

		mockAuthTokenManager.verifyRefreshToken = jest
			.fn<typeof mockAuthTokenManager.verifyRefreshToken>()
			.mockImplementation(async () => Promise.resolve());
		mockAuthenticationRepository.checkTokenAvailability = jest
			.fn<typeof mockAuthenticationRepository.checkTokenAvailability>()
			.mockImplementation(async () => Promise.resolve());
		mockAuthTokenManager.decodePayload = jest.fn<typeof mockAuthTokenManager.decodePayload>()
			.mockImplementation(async () => Promise.resolve({id: 'user-123', username: 'dicoding'}));
		mockAuthTokenManager.createAccessToken = jest
			.fn<typeof mockAuthTokenManager.createAccessToken>()
			.mockImplementation(async () => Promise.resolve('new_access_token'));

		const refreshAuth = new RefreshAuth(mockAuthenticationRepository, mockAuthTokenManager);

		const accessToken = await refreshAuth.execute(useCasePayload);

		expect(accessToken).toEqual('new_access_token');
		expect(mockAuthTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
		expect(mockAuthenticationRepository.checkTokenAvailability).toBeCalledWith(useCasePayload.refreshToken);
		expect(mockAuthTokenManager.decodePayload).toBeCalledWith(useCasePayload.refreshToken);
		expect(mockAuthTokenManager.createAccessToken).toBeCalledWith({id: 'user-123', username: 'dicoding'});
	});
});
