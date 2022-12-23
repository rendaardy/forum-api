import {describe, it, expect} from '@jest/globals';

import {AuthenticationRepository} from '../authentication-repository.js';

describe('AuthenticationRepository interface', () => {
	it('should throw an error when invoking unimplemented methods', async () => {
		const authRepository = new AuthenticationRepository();

		await expect(authRepository.addToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(authRepository.checkTokenAvailability('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(authRepository.deleteToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});
