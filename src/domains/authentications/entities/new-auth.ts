export type Payload = {
	accessToken?: unknown;
	refreshToken?: unknown;
};

export class NewAuth {
	accessToken: string;
	refreshToken: string;

	constructor(payload: Payload) {
		const {accessToken, refreshToken} = this.#verifyPayload(payload);

		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}

	#verifyPayload({accessToken, refreshToken}: Payload): {accessToken: string; refreshToken: string} {
		if (!accessToken || !refreshToken) {
			throw new Error('NEW_AUTH.NOT_MEET_REQUIRED_PROPERTIES');
		}

		if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
			throw new Error('NEW_AUTH.TYPE_MISMATCH');
		}

		return {accessToken, refreshToken};
	}
}
