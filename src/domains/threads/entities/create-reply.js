/**
 * @typedef {object} Payload
 * @property {unknown} [content]
 */

export class CreateReply {
	content;

	/**
     * @param {Payload} payload
     */
	constructor(payload) {
		const {content} = this.#validatePayload(payload);

		this.content = content;
	}

	/**
     * @param {Payload} payload
     */
	#validatePayload({content}) {
		if (content === undefined) {
			throw new Error('CREATE_REPLY.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof content !== 'string') {
			throw new Error('CREATE_REPLY.TYPE_MISMATCH');
		}

		return {content};
	}
}
