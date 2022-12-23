/**
 * @typedef {object} Payload
 * @property {unknown} [username]
 * @property {unknown} [password]
 * @property {unknown} [fullname]
 */

export class RegisterUser {
	username;
	password;
	fullname;

	/**
   * @param {Payload} payload
   */
	constructor(payload) {
		const {username, password, fullname} = this.#verifyPayload(payload);

		this.username = username;
		this.password = password;
		this.fullname = fullname;
	}

	/**
   * @param {Payload} payload
   * @returns {{username: string; password: string; fullname: string}}
   */
	#verifyPayload({username, password, fullname}) {
		if (!username || !password || !fullname) {
			throw new Error('REGISTER_USER.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
			throw new Error('REGISTER_USER.TYPE_MISMATCH');
		}

		if (username.length > 50) {
			throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
		}

		if (!username.match(/^[\w]+$/)) {
			throw new Error('REGISTER_USER.USERNAME_CONTAIN_FORBIDDEN_CHARACTERS');
		}

		return {username, password, fullname};
	}
}
