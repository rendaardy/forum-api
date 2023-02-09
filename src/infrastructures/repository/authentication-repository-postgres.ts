import {InvariantError} from '#commons/exceptions/invariant-error.ts';
import {AuthenticationRepository} from '#domains/authentications/authentication-repository.ts';

import type {Pool} from 'pg';

export class AuthenticationRepositoryPostgres extends AuthenticationRepository {
	#pool: Pool;

	constructor(pool: Pool) {
		super();

		this.#pool = pool;
	}

	async addToken(token: string): Promise<void> {
		const query = {
			text: 'INSERT INTO authentications VALUES ($1)',
			values: [token],
		};

		await this.#pool.query(query);
	}

	async checkTokenAvailability(token: string): Promise<void> {
		const query = {
			text: 'SELECT token FROM authentications WHERE token = $1',
			values: [token],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			// Throw new InvariantError('refresh token not found');
			throw new InvariantError('refresh token tidak ditemukan di database');
		}
	}

	async deleteToken(token: string): Promise<void> {
		const query = {
			text: 'DELETE FROM authentications WHERE token = $1',
			values: [token],
		};

		await this.#pool.query(query);
	}
}
