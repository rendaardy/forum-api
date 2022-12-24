/**
 * @typedef {object} Payload
 * @property {unknown} [id]
 * @property {unknown} [title]
 * @property {unknown} [owner]
 */

export class CreatedThread {
	id;
	title;
	owner;

	/**
   * @param {Payload} payload
   */
	constructor(payload) {
		const {id, title, owner} = this.#validatePayload(payload);

		this.id = id;
		this.title = title;
		this.owner = owner;
	}

	/**
   * @param {Payload} payload
   * @returns {{ id: string; title: string; owner: string }}
   */
	#validatePayload({id, title, owner}) {
		if (id === undefined || title === undefined || owner === undefined) {
			throw new Error('CREATED_THREAD.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
			throw new Error('CREATED_THREAD.TYPE_MISMATCH');
		}

		return {id, title, owner};
	}
}
