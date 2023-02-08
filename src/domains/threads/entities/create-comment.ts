export type Payload = {
	content?: unknown;
};

export class CreateComment {
	content: string;

	constructor(payload: Payload) {
		const {content} = this.#validatePayload(payload);

		this.content = content;
	}

	#validatePayload({content}: Payload): {content: string} {
		if (content === undefined) {
			throw new Error('CREATE_COMMENT.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof content !== 'string') {
			throw new Error('CREATE_COMMENT.TYPE_MISMATCH');
		}

		return {content};
	}
}
