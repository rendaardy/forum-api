/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-unsafe-return */

/* c8 ignore start */

import {pool} from '#infrastructures/database/postgres/pool.ts';

export class AuthenticationsTableTestHelper {
	static async addToken(token: string) {
		const query = {
			text: 'INSERT INTO authentications VALUES ($1)',
			values: [token],
		};

		await pool.query(query);
	}

	static async findToken(token: string) {
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
