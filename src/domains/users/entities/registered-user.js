/**
 * @typedef {object} Payload
 * @property {unknown} [id]
 * @property {unknown} [username]
 * @property {unknown} [fullname]
 */

export class RegisteredUser {
	id;
	username;
	fullname;

	/**
   * @param {Payload} payload
   */
	constructor(payload) {
		const {id, username, fullname} = this.#verifyPayload(payload);

		this.id = id;
		this.username = username;
		this.fullname = fullname;
	}

	/**
   * @param {Payload} payload
   * @returns {{id: string; username: string; fullname: string}}
   */
	#verifyPayload({id, username, fullname}) {
		if (!id || !username || !fullname) {
			throw new Error('REGISTERED_USER.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string') {
			throw new Error('REGISTERED_USER.TYPE_MISMATCH');
		}

		return {id, username, fullname};
	}
}
