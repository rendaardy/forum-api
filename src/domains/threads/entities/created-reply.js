/**
 * @typedef {object} Payload
 * @property {unknown} [id]
 * @property {unknown} [content]
 * @property {unknown} [owner]
 */

export class CreatedReply {
	id;
	content;
	owner;

	/**
     * @param {Payload} payload
     */
	constructor(payload) {
		const {id, content, owner} = this.#validatePayload(payload);

		this.id = id;
		this.content = content;
		this.owner = owner;
	}

	/**
     * @param {Payload} payload
     */
	#validatePayload({id, content, owner}) {
		if (id === undefined || content === undefined || owner === undefined) {
			throw new Error('CREATED_REPLY.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
			throw new Error('CREATED_REPLY.TYPE_MISMATCH');
		}

		return {id, content, owner};
	}
}
