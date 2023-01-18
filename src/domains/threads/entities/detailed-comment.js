import {DetailedReply} from './detailed-reply.js';

/**
 * @typedef {object} Payload
 * @property {unknown} [id]
 * @property {unknown} [username]
 * @property {unknown} [date]
 * @property {unknown} [content]
 * @property {Array<unknown>} [replies]
 * @property {boolean} [isDeleted]
 */

export class DetailedComment {
	id;
	username;
	date;
	content;
	replies;

	/**
     * @param {Payload} payload
     */
	constructor(payload) {
		const {id, username, date, content, replies} = this.#validatePayload(payload);

		this.id = id;
		this.username = username;
		this.date = date;
		this.content = payload?.isDeleted ? '**komentar telah dihapus**' : content;
		this.replies = [];

		for (const reply of replies) {
			const detailedReply = new DetailedReply(/** @type {any} */(reply));
			this.replies.push(detailedReply);
		}
	}

	/**
     * @param {Payload} payload
     */
	#validatePayload({id, username, date, content, replies}) {
		if (id === undefined
        || username === undefined
        || date === undefined
        || content === undefined
        || replies === undefined) {
			throw new Error('DETAILED_COMMENT.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof id !== 'string'
        || typeof username !== 'string'
        || !(date instanceof Date)
        || typeof content !== 'string'
        || !(replies instanceof Array)) {
			throw new Error('DETAILED_COMMENT.TYPE_MISMATCH');
		}

		return {id, username, date, content, replies};
	}
}
