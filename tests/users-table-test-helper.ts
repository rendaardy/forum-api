/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-unsafe-return */

/* c8 ignore start */

import {pool} from '#infrastructures/database/postgres/pool.ts';

export class UsersTableTestHelper {
	static async addUser({
		id = 'user-123',
		username = 'dicoding',
		password = 'secret',
		fullname = 'Dicoding Indonesia',
	}) {
		const query = {
			text: 'INSERT INTO users VALUES ($1, $2, $3, $4)',
			values: [id, username, password, fullname],
		};

		await pool.query(query);
	}

	static async findUsersById(id: string) {
		const query = {
			text: 'SELECT id, username, password, fullname FROM users WHERE id = $1',
			values: [id],
		};

		const result = await pool.query(query);

		return result.rows;
	}

	static async clearTable() {
		await pool.query('TRUNCATE TABLE users CASCADE');
	}
}

/* c8 ignore stop */
