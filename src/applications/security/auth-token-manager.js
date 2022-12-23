/**
 * @interface AuthTokenManager
 */
export class AuthTokenManager {
	/**
   * @param {any} _payload
   * @returns {Promise<string>}
   */
	async createAccessToken(_payload) {
		throw new Error('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	}

	/**
   * @param {any} _payload
   * @returns {Promise<string>}
   */
	async createRefreshToken(_payload) {
		throw new Error('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	}

	/**
   * @param {string} _token
   */
	async verifyRefreshToken(_token) {
		throw new Error('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	}

	/**
   * @param {string} _accessToken
   * @returns {Promise<any>}
   */
	async decodePayload(_accessToken) {
		throw new Error('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	}
}
