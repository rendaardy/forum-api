import {DetailedComment} from './detailed-comment.ts';

export type Payload = {
	id?: unknown;
	title?: unknown;
	body?: unknown;
	date?: unknown;
	username?: unknown;
	comments?: unknown[];
};

export class DetailedThread {
	id: string;
	title: string;
	body: string;
	date: Date;
	username: string;
	comments: DetailedComment[];

	constructor(payload: Payload) {
		const {id, title, body, date, username, comments} = this.#validatePayload(payload);

		this.id = id;
		this.title = title;
		this.body = body;
		this.date = date;
		this.username = username;
		this.comments = [];

		for (const comment of comments) {
			const detailedComment = new DetailedComment(comment as any);
			this.comments.push(detailedComment);
		}
	}

	#validatePayload(payload: Payload): {
		id: string;
		title: string;
		body: string;
		date: Date;
		username: string;
		comments: unknown[];
	} {
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
        || !(date instanceof Date)
        || typeof username !== 'string'
        || !(comments instanceof Array)) {
			throw new Error('DETAILED_THREAD.TYPE_MISMATCH');
		}

		return {id, title, body, date, username, comments};
	}
}
