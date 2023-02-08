import {DetailedReply} from './detailed-reply.ts';

export type Payload = {
	id?: unknown;
	username?: unknown;
	date?: unknown;
	content?: unknown;
	replies?: unknown[];
	isDeleted?: boolean;
};

export class DetailedComment {
	id: string;
	username: string;
	date: Date;
	content: string;
	replies: DetailedReply[];

	constructor(payload: Payload) {
		const {id, username, date, content, replies} = this.#validatePayload(payload);

		this.id = id;
		this.username = username;
		this.date = date;
		this.content = payload?.isDeleted ? '**komentar telah dihapus**' : content;
		this.replies = [];

		for (const reply of replies) {
			const detailedReply = new DetailedReply(reply as any);
			this.replies.push(detailedReply);
		}
	}

	#validatePayload({id, username, date, content, replies}: Payload): {
		id: string;
		username: string;
		date: Date;
		content: string;
		replies: unknown[];
	} {
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
