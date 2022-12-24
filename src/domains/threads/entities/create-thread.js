/**
 * @typedef {object} Payload
 * @property {unknown} [title]
 * @property {unknown} [body]
 */

export class CreateThread {
	title;
	body;

	/**
   * @param {Payload} payload
   */
	constructor(payload) {
		const {title, body} = this.#verifyPayload(payload);

		this.title = title;
		this.body = body;
	}

	/**
   * @param {Payload} payload
   * @returns {{ title: string; body: string }}
   */
	#verifyPayload({title, body}) {
		if (!title || !body) {
			throw new Error('CREATE_THREAD.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof title !== 'string' || typeof body !== 'string') {
			throw new Error('CREATE_THREAD.TYPE_MISMATCH');
		}

		return {title, body};
	}
}
