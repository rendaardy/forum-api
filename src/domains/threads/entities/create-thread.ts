export type Payload = {
	title?: unknown;
	body?: unknown;
};

export class CreateThread {
	title: string;
	body: string;

	constructor(payload: Payload) {
		const {title, body} = this.#validatePayload(payload);

		this.title = title;
		this.body = body;
	}

	#validatePayload({title, body}: Payload): {title: string; body: string} {
		if (!title || !body) {
			throw new Error('CREATE_THREAD.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof title !== 'string' || typeof body !== 'string') {
			throw new Error('CREATE_THREAD.TYPE_MISMATCH');
		}

		return {title, body};
	}
}
