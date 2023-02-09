export type Payload = {
	id?: unknown;
	username?: unknown;
	date?: unknown;
	content?: unknown;
	isDeleted?: unknown;
};

export class DetailedReply {
	id: string;
	username: string;
	date: Date;
	content: string;

	constructor(payload: Payload) {
		const {id, username, date, content} = this.#validatePayload(payload);

		this.id = id;
		this.username = username;
		this.date = date;
		this.content = payload.isDeleted ? '**balasan telah dihapus**' : content;
	}

	#validatePayload({id, username, date, content}: Payload): {
		id: string;
		username: string;
		date: Date;
		content: string;
	} {
		if (id === undefined
        || username === undefined
        || date === undefined
        || content === undefined) {
			throw new Error('DETAILED_REPLY.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof id !== 'string'
        || typeof username !== 'string'
        || !(date instanceof Date)
        || typeof content !== 'string') {
			throw new Error('DETAILED_REPLY.TYPE_MISMATCH');
		}

		return {id, username, date, content};
	}
}
