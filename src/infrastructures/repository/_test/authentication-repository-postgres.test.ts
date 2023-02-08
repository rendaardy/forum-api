import {describe, it, expect, afterEach, afterAll} from '@jest/globals';

import {AuthenticationsTableTestHelper} from '#tests/authentications-table-test-helper.ts';
import {pool} from '#infrastructures/database/postgres/pool.ts';
import {InvariantError} from '#commons/exceptions/invariant-error.ts';
import {AuthenticationRepositoryPostgres} from '../authentication-repository-postgres.ts';

describe('AuthenticationRepositoryPostgres', () => {
	afterEach(async () => {
		await AuthenticationsTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('addToken method', () => {
		it('should add token to database', async () => {
			const authRepository = new AuthenticationRepositoryPostgres(pool);
			const token = 'token';

			await authRepository.addToken(token);

			const tokens = await AuthenticationsTableTestHelper.findToken(token);
			expect(tokens).toHaveLength(1);
			expect(tokens[0].token).toBe(token);
		});
	});

	describe('checkTokenAvailability method', () => {
		it('should throw InvariantError if refresh token isn\'t available', async () => {
			const authRepository = new AuthenticationRepositoryPostgres(pool);
			const token = 'token';

			await expect(authRepository.checkTokenAvailability(token)).rejects
				.toThrowError(InvariantError);
		});

		it('shouldn\'t throw InvariantError if refresh token is available', async () => {
			await AuthenticationsTableTestHelper.addToken('token');

			const authRepository = new AuthenticationRepositoryPostgres(pool);
			const token = 'token';

			await expect(authRepository.checkTokenAvailability(token)).resolves.not
				.toThrowError(InvariantError);
		});
	});

	describe('deleteToken method', () => {
		it('should delete token from database', async () => {
			await AuthenticationsTableTestHelper.addToken('token');

			const authRepository = new AuthenticationRepositoryPostgres(pool);
			const token = 'token';

			await authRepository.deleteToken(token);

			const tokens = await AuthenticationsTableTestHelper.findToken(token);
			expect(tokens).toHaveLength(0);
		});
	});
});
