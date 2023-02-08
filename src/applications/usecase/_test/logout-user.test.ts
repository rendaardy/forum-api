import {describe, it, expect, jest} from '@jest/globals';

import {AuthenticationRepository} from '#domains/authentications/authentication-repository.ts';
import {LogoutUser} from '../logout-user.ts';

describe('LogoutUser usecase', () => {
	it('should throw an error when the payload doesn\'t contain refresh token', async () => {
		const useCasePayload = {};
		const mockAuthenticationRepository = new AuthenticationRepository();
		const logoutUser = new LogoutUser(mockAuthenticationRepository);

		await expect(logoutUser.execute(useCasePayload)).rejects
			.toThrowError('USER_LOGOUT_USECASE.NOT_CONTAIN_REFRESH_TOKEN');
	});

	it('should throw an error if refresh token isn\'t of type string', async () => {
		const useCasePayload = {
			refreshToken: 123,
		};
		const mockAuthenticationRepository = new AuthenticationRepository();
		const logoutUser = new LogoutUser(mockAuthenticationRepository);

		await expect(logoutUser.execute(useCasePayload)).rejects
			.toThrowError('USER_LOGOUT_USECASE.TYPE_MISMATCH');
	});

	it('should orchestrate the logout user usecase correctly', async () => {
		const useCasePayload = {
			refreshToken: 'refreshToken',
		};
		const mockAuthenticationRepository = new AuthenticationRepository();

		mockAuthenticationRepository.checkTokenAvailability = jest
			.fn<typeof mockAuthenticationRepository.checkTokenAvailability>()
			.mockImplementation(async () => Promise.resolve());
		mockAuthenticationRepository.deleteToken = jest
			.fn<typeof mockAuthenticationRepository.deleteToken>()
			.mockImplementation(async () => Promise.resolve());

		const logoutUser = new LogoutUser(mockAuthenticationRepository);

		await logoutUser.execute(useCasePayload);

		expect(mockAuthenticationRepository.checkTokenAvailability)
			.toHaveBeenCalledWith(useCasePayload.refreshToken);
		expect(mockAuthenticationRepository.deleteToken)
			.toHaveBeenCalledWith(useCasePayload.refreshToken);
	});
});
