/**
 * @typedef {object} Payload
 * @property {unknown} [id]
 * @property {unknown} [username]
 * @property {unknown} [date]
 * @property {unknown} [content]
 */

export class DetailedComment {
	id;
	username;
	date;
	content;

	/**
   * @param {Payload} payload
   */
	constructor(payload) {
		const {id, username, date, content} = this.#validatePayload(payload);

		this.id = id;
		this.username = username;
		this.date = date;
		this.content = content;
	}

	/**
   * @param {Payload} payload
   */
	#validatePayload({id, username, date, content}) {
		if (id === undefined
      || username === undefined
      || date === undefined
      || content === undefined) {
			throw new Error('DETAILED_COMMENT.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof id !== 'string'
      || typeof username !== 'string'
      || !(date instanceof Date)
      || typeof content !== 'string') {
			throw new Error('DETAILED_COMMENT.TYPE_MISMATCH');
		}

		return {id, username, date, content};
	}
}
