/* c8 ignore start */

import {pool} from '#infrastructures/database/postgres/pool.js';

export class AuthenticationsTableTestHelper {
	/**
   * @param {string} token
   */
	static async addToken(token) {
		const query = {
			text: 'INSERT INTO authentications VALUES ($1)',
			values: [token],
		};

		await pool.query(query);
	}

	/**
   * @param {string} token
   */
	static async findToken(token) {
		const query = {
			text: 'SELECT token FROM authentications WHERE token = $1',
			values: [token],
		};
		const result = await pool.query(query);

		return result.rows;
	}

	static async cleanTable() {
		await pool.query('TRUNCATE TABLE authentications');
	}
}

/* c8 ignore stop */
