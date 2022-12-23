import {InvariantError} from '#commons/exceptions/invariant-error.js';
import {AuthenticationRepository} from '#domains/authentications/authentication-repository.js';

/**
 * @implements AuthenticationRepository
 */
export class AuthenticationRepositoryPostgres extends AuthenticationRepository {
	#pool;

	/**
   * @param {import("pg").Pool} pool
   */
	constructor(pool) {
		super();

		this.#pool = pool;
	}

	/**
   * @param {string} token
   */
	async addToken(token) {
		const query = {
			text: 'INSERT INTO authentications VALUES ($1)',
			values: [token],
		};

		await this.#pool.query(query);
	}

	/**
   * @param {string} token
   */
	async checkTokenAvailability(token) {
		const query = {
			text: 'SELECT token FROM authentications WHERE token = $1',
			values: [token],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new InvariantError('refresh token not found');
		}
	}

	/**
   * @param {string} token
   */
	async deleteToken(token) {
		const query = {
			text: 'DELETE FROM authentications WHERE token = $1',
			values: [token],
		};

		await this.#pool.query(query);
	}
}
