import {describe, it, expect} from '@jest/globals';

import {AuthTokenManager} from '../auth-token-manager.ts';

describe('AuthTokenManager interface', () => {
	it('should throw an error when invoking unimplemented methods', async () => {
		const tokenManager = new AuthTokenManager();

		await expect(tokenManager.createAccessToken(''))
			.rejects.toThrowError('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
		await expect(tokenManager.createRefreshToken(''))
			.rejects.toThrowError('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
		await expect(tokenManager.verifyRefreshToken(''))
			.rejects.toThrowError('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
		await expect(tokenManager.decodePayload(''))
			.rejects.toThrowError('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	});
});
