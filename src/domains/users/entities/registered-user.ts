export type Payload = {
	id?: unknown;
	username?: unknown;
	fullname?: unknown;
};

export class RegisteredUser {
	id: string;
	username: string;
	fullname: string;

	constructor(payload: Payload) {
		const {id, username, fullname} = this.#verifyPayload(payload);

		this.id = id;
		this.username = username;
		this.fullname = fullname;
	}

	#verifyPayload({id, username, fullname}: Payload): {id: string; username: string; fullname: string} {
		if (!id || !username || !fullname) {
			throw new Error('REGISTERED_USER.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string') {
			throw new Error('REGISTERED_USER.TYPE_MISMATCH');
		}

		return {id, username, fullname};
	}
}
