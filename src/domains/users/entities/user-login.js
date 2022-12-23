/**
 * @typedef {object} Payload
 * @property {unknown} [username]
 * @property {unknown} [password]
 */

export class UserLogin {
	username;
	password;

	/**
   * @param {Payload} payload
   */
	constructor(payload) {
		const {username, password} = this.#verifyPayload(payload);

		this.username = username;
		this.password = password;
	}

	/**
   * @param {Payload} payload
   * @returns {{ username: string; password: string }}
   */
	#verifyPayload({username, password}) {
		if (!username || !password) {
			throw new Error('USER_LOGIN.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof username !== 'string' || typeof password !== 'string') {
			throw new Error('USER_LOGIN.TYPE_MISMATCH');
		}

		return {username, password};
	}
}
