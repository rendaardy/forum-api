import {env} from 'node:process';

import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
	http: {
		host: env.HOST,
		port: env.PORT,
	},
	jwt: {
		accessTokenKey: env.ACCESS_TOKEN_KEY,
		refreshTokenKey: env.REFRESH_TOKEN_KEY,
		tokenAge: env.TOKEN_AGE,
	},
};
