import {AuthTokenManager} from '#applications/security/auth-token-manager.js';
import {InvariantError} from '#commons/exceptions/invariant-error.js';

/**
 * @implements AuthTokenManager
 */
export class JwtTokenManager extends AuthTokenManager {
	#jwt;
	#accessTokenKey;
	#refreshTokenKey;

	/**
   * @param {typeof import("@hapi/jwt").token} jwt
   * @param {string} accessTokenKey
   * @param {string} refreshTokenKey
   */
	constructor(jwt, accessTokenKey, refreshTokenKey) {
		super();

		this.#jwt = jwt;
		this.#accessTokenKey = accessTokenKey;
		this.#refreshTokenKey = refreshTokenKey;
	}

	/**
   * @param {any} payload
   * @returns {Promise<string>}
   */
	async createAccessToken(payload) {
		if (!this.#accessTokenKey) {
			throw new Error('ACCESS_TOKEN_KEY must be set');
		}

		return this.#jwt.generate(payload, this.#accessTokenKey);
	}

	/**
   * @param {any} payload
   * @returns {Promise<string>}
   */
	async createRefreshToken(payload) {
		if (!this.#refreshTokenKey) {
			throw new Error('REFRESH_TOKEN_KEY must be set');
		}

		return this.#jwt.generate(payload, this.#refreshTokenKey);
	}

	/**
   * @param {string} token
   */
	async verifyRefreshToken(token) {
		if (!this.#refreshTokenKey) {
			throw new Error('REFRESH_TOKEN_KEY must be set');
		}

		try {
			const artifacts = this.#jwt.decode(token);
			this.#jwt.verify(artifacts, this.#refreshTokenKey);
		} catch {
			throw new InvariantError('invalid refresh token');
		}
	}

	/**
   * @param {string} accessToken
   * @returns {Promise<any>}
   */
	async decodePayload(accessToken) {
		const artifacts = this.#jwt.decode(accessToken);

		return artifacts.decoded.payload;
	}
}
