import {UserRepository} from '#domains/users/user-repository.ts';
import {RegisteredUser} from '#domains/users/entities/registered-user.ts';
import {InvariantError} from '#commons/exceptions/invariant-error.ts';

import type {Pool} from 'pg';
import type {RegisterUser} from '#domains/users/entities/register-user.ts';

type IdGeneratorFunction = () => string;

export class UserRepositoryPostgres extends UserRepository {
	#pool: Pool;
	#idGenerator: IdGeneratorFunction;

	constructor(pool: Pool, idGenerator: IdGeneratorFunction) {
		super();

		this.#pool = pool;
		this.#idGenerator = idGenerator;
	}

	async verifyAvailableUsername(username: string): Promise<void> {
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

	async addUser(registerUser: RegisterUser): Promise<RegisteredUser> {
		const {username, password, fullname} = registerUser;
		const id = `user-${this.#idGenerator()}`;
		const query = {
			text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id, username, fullname',
			values: [id, username, password, fullname],
		};
		const result = await this.#pool.query(query);

		return new RegisteredUser({...result.rows[0]});
	}

	async getPasswordByUsername(username: string): Promise<string> {
		const query = {
			text: 'SELECT password FROM users WHERE username = $1',
			values: [username],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new InvariantError('Username not found');
		}

		return result.rows[0].password as string;
	}

	async getIdByUsername(username: string): Promise<string> {
		const query = {
			text: 'SELECT id FROM users WHERE username = $1',
			values: [username],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new InvariantError('Username not found');
		}

		return result.rows[0].id as string;
	}
}
