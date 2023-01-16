import {UserRepository} from '#domains/users/user-repository.js';
import {RegisteredUser} from '#domains/users/entities/registered-user.js';
import {InvariantError} from '#commons/exceptions/invariant-error.js';

/**
 * @typedef {() => string} IdGeneratorFunction
 */

/**
 * @implements UserRepository
 */
export class UserRepositoryPostgres extends UserRepository {
	#pool;
	#idGenerator;

	/**
   * @param {import("pg").Pool} pool
   * @param {IdGeneratorFunction} idGenerator
   */
	constructor(pool, idGenerator) {
		super();

		this.#pool = pool;
		this.#idGenerator = idGenerator;
	}

	/**
   * @param {string} username
   */
	async verifyAvailableUsername(username) {
		const query = {
			text: 'SELECT username FROM users WHERE username = $1',
			values: [username],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount > 0) {
			// Throw new InvariantError('Failed to create a new user. Username isn\'t available');
			throw new InvariantError('username tidak tersedia');
		}
	}

	/**
   * @param {import("#domains/users/entities/register-user.js").RegisterUser} registerUser
   * @returns {Promise<RegisteredUser>}
   */
	async addUser(registerUser) {
		const {username, password, fullname} = registerUser;
		const id = `user-${this.#idGenerator()}`;
		const query = {
			text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id, username, fullname',
			values: [id, username, password, fullname],
		};
		const result = await this.#pool.query(query);

		return new RegisteredUser({...result.rows[0]});
	}

	/**
   * @param {string} username
   * @returns {Promise<string>}
   */
	async getPasswordByUsername(username) {
		const query = {
			text: 'SELECT password FROM users WHERE username = $1',
			values: [username],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new InvariantError('Username not found');
		}

		return result.rows[0].password;
	}

	/**
   * @param {string} username
   * @returns {Promise<string>}
   */
	async getIdByUsername(username) {
		const query = {
			text: 'SELECT id FROM users WHERE username = $1',
			values: [username],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new InvariantError('Username not found');
		}

		return result.rows[0].id;
	}
}
