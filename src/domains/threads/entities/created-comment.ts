export type Payload = {
	id?: unknown;
	content?: unknown;
	owner?: unknown;
};

export class CreatedComment {
	id: string;
	content: string;
	owner: string;

	constructor(payload: Payload) {
		const {id, content, owner} = this.#validatePayload(payload);

		this.id = id;
		this.content = content;
		this.owner = owner;
	}

	#validatePayload({id, content, owner}: Payload): {id: string; content: string; owner: string} {
		if (id === undefined || content === undefined || owner === undefined) {
			throw new Error('CREATED_COMMENT.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
			throw new Error('CREATED_COMMENT.TYPE_MISMATCH');
		}

		return {id, content, owner};
	}
}
