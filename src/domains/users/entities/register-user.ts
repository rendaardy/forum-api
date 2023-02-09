export type Payload = {
	username?: unknown;
	password?: unknown;
	fullname?: unknown;
};

export class RegisterUser {
	username: string;
	password: string;
	fullname: string;

	constructor(payload: Payload) {
		const {username, password, fullname} = this.#verifyPayload(payload);

		this.username = username;
		this.password = password;
		this.fullname = fullname;
	}

	#verifyPayload({username, password, fullname}: Payload): {username: string; password: string; fullname: string} {
		if (!username || !password || !fullname) {
			throw new Error('REGISTER_USER.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
			throw new Error('REGISTER_USER.TYPE_MISMATCH');
		}

		if (username.length > 50) {
			throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
		}

		if (!(/^[\w]+$/.exec(username))) {
			throw new Error('REGISTER_USER.USERNAME_CONTAIN_FORBIDDEN_CHARACTERS');
		}

		return {username, password, fullname};
	}
}
