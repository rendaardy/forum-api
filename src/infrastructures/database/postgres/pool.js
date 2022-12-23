/* c8 ignore start */

import {env} from 'node:process';

import pg from 'pg';

const testConfig = {
	host: env.PGHOST_TEST,
	port: Number(env.PGPORT_TEST),
	user: env.PGUSER_TEST,
	password: env.PGPASSWORD_TEST,
	database: env.PGDATABASE_TEST,
};

export const pool = env.NODE_ENV === 'test' ? new pg.Pool(testConfig) : new pg.Pool();

/* c8 ignore stop */
