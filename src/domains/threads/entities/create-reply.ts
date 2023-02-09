export type Payload = {
	content?: unknown;
};

export class CreateReply {
	content: string;

	constructor(payload: Payload) {
		const {content} = this.#validatePayload(payload);

		this.content = content;
	}

	#validatePayload({content}: Payload): {content: string} {
		if (content === undefined) {
			throw new Error('CREATE_REPLY.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof content !== 'string') {
			throw new Error('CREATE_REPLY.TYPE_MISMATCH');
		}

		return {content};
	}
}
