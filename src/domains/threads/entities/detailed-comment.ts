import {DetailedReply} from './detailed-reply.ts';

export type Payload = {
	id?: unknown;
	username?: unknown;
	date?: unknown;
	content?: unknown;
	likeCount?: unknown;
	replies?: unknown[];
	isDeleted?: boolean;
};

export class DetailedComment {
	id: string;
	username: string;
	date: Date;
	content: string;
	likeCount: number;
	replies: DetailedReply[];

	constructor(payload: Payload) {
		const {id, username, date, content, likeCount, replies} = this.#validatePayload(payload);

		this.id = id;
		this.username = username;
		this.date = date;
		this.content = payload.isDeleted ? '**komentar telah dihapus**' : content;
		this.likeCount = likeCount;
		this.replies = [];

		for (const reply of replies) {
			const detailedReply = new DetailedReply(reply as any);
			this.replies.push(detailedReply);
		}
	}

	#validatePayload({id, username, date, content, likeCount, replies}: Payload): {
		id: string;
		username: string;
		date: Date;
		content: string;
		likeCount: number;
		replies: unknown[];
	} {
		if (id === undefined
        || username === undefined
        || date === undefined
        || content === undefined
        || likeCount === undefined
        || replies === undefined) {
			throw new Error('DETAILED_COMMENT.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof id !== 'string'
        || typeof username !== 'string'
        || !(date instanceof Date)
        || typeof content !== 'string'
        || typeof likeCount !== 'number'
        || !(replies instanceof Array)) {
			throw new Error('DETAILED_COMMENT.TYPE_MISMATCH');
		}

		return {id, username, date, content, likeCount, replies};
	}
}
