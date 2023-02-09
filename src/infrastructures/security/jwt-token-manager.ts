import {AuthTokenManager} from '#applications/security/auth-token-manager.ts';
import {InvariantError} from '#commons/exceptions/invariant-error.ts';

import type {token} from '@hapi/jwt';

export class JwtTokenManager extends AuthTokenManager {
	#jwt: typeof token;
	#accessTokenKey: string;
	#refreshTokenKey: string;

	constructor(jwt: typeof token, accessTokenKey: string, refreshTokenKey: string) {
		super();

		this.#jwt = jwt;
		this.#accessTokenKey = accessTokenKey;
		this.#refreshTokenKey = refreshTokenKey;
	}

	async createAccessToken(payload: any): Promise<string> {
		if (!this.#accessTokenKey) {
			throw new Error('ACCESS_TOKEN_KEY must be set');
		}

		return this.#jwt.generate(payload, this.#accessTokenKey);
	}

	async createRefreshToken(payload: any): Promise<string> {
		if (!this.#refreshTokenKey) {
			throw new Error('REFRESH_TOKEN_KEY must be set');
		}

		return this.#jwt.generate(payload, this.#refreshTokenKey);
	}

	async verifyRefreshToken(token: string): Promise<void> {
		if (!this.#refreshTokenKey) {
			throw new Error('REFRESH_TOKEN_KEY must be set');
		}

		try {
			const artifacts = this.#jwt.decode(token);
			this.#jwt.verify(artifacts, this.#refreshTokenKey);
		} catch {
			// Throw new InvariantError('invalid refresh token');
			throw new InvariantError('refresh token tidak valid');
		}
	}

	async decodePayload(accessToken: string): Promise<any> {
		const artifacts = this.#jwt.decode(accessToken);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return artifacts.decoded.payload;
	}
}
