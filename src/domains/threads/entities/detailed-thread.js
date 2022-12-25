import {DetailedComment} from './detailed-comment.js';

/**
 * @typedef {object} Payload
 * @property {unknown} [id]
 * @property {unknown} [title]
 * @property {unknown} [body]
 * @property {unknown} [date]
 * @property {unknown} [username]
 * @property {unknown} [comments]
 */

export class DetailedThread {
	id;
	title;
	body;
	date;
	username;
	comments;

	/**
   * @param {Payload} payload
   */
	constructor(payload) {
		const {id, title, body, date, username, comments} = this.#validatePayload(payload);

		this.id = id;
		this.title = title;
		this.body = body;
		this.date = date;
		this.username = username;
		this.comments = [];

		for (const comment of comments) {
			const detailedComment = new DetailedComment(comment);
			this.comments.push(detailedComment);
		}
	}

	/**
   * @param {Payload} payload
   * @returns {{ id: string; title: string; body: string; date: string; username: string; comments: Array<any> }}
   */
	#validatePayload(payload) {
		const {id, title, body, date, username, comments} = payload;

		if (id === undefined
      || title === undefined
      || body === undefined
      || date === undefined
      || username === undefined
      || comments === undefined) {
			throw new Error('DETAILED_THREAD.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || !(comments instanceof Array)) {
			throw new Error('DETAILED_THREAD.TYPE_MISMATCH');
		}

		return {id, title, body, date, username, comments};
	}
}
