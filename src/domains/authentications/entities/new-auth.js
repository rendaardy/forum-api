/**
 * @typedef {object} Payload
 * @property {unknown} [accessToken]
 * @property {unknown} [refreshToken]
 */

export class NewAuth {
	accessToken;
	refreshToken;

	/**
   * @param {Payload} payload
   */
	constructor(payload) {
		const {accessToken, refreshToken} = this.#verifyPayload(payload);

		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}

	/**
   * @param {Payload} payload
   * @returns {{ accessToken: string; refreshToken: string }}
   */
	#verifyPayload({accessToken, refreshToken}) {
		if (!accessToken || !refreshToken) {
			throw new Error('NEW_AUTH.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
			throw new Error('NEW_AUTH.TYPE_MISMATCH');
		}

		return {accessToken, refreshToken};
	}
}
