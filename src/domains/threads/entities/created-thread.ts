export type Payload = {
	id?: unknown;
	title?: unknown;
	owner?: unknown;
};

export class CreatedThread {
	id: string;
	title: string;
	owner: string;

	constructor(payload: Payload) {
		const {id, title, owner} = this.#validatePayload(payload);

		this.id = id;
		this.title = title;
		this.owner = owner;
	}

	#validatePayload({id, title, owner}: Payload): {id: string; title: string; owner: string} {
		if (id === undefined || title === undefined || owner === undefined) {
			throw new Error('CREATED_THREAD.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
			throw new Error('CREATED_THREAD.TYPE_MISMATCH');
		}

		return {id, title, owner};
	}
}
