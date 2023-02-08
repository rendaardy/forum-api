import {describe, it, expect} from '@jest/globals';

import {PasswordHash} from '../password-hash.ts';

describe('PasswordHash interface', () => {
	it('should throw an error when calling interface method directly', async () => {
		const passwordHash = new PasswordHash();

		await expect(passwordHash.hash('dummy_password'))
			.rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
		await expect(passwordHash.compare('dummy_password', 'encrypted'))
			.rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
	});
});
