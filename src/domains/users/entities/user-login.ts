export type Payload = {
	username?: unknown;
	password?: unknown;
};

export class UserLogin {
	username: string;
	password: string;

	constructor(payload: Payload) {
		const {username, password} = this.#verifyPayload(payload);

		this.username = username;
		this.password = password;
	}

	#verifyPayload({username, password}: Payload): {username: string; password: string} {
		if (!username || !password) {
			throw new Error('USER_LOGIN.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof username !== 'string' || typeof password !== 'string') {
			throw new Error('USER_LOGIN.TYPE_MISMATCH');
		}

		return {username, password};
	}
}
