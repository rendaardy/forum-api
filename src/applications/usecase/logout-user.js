export class LogoutUser {
	#authenticationRepository;

	/**
   * @param {import("#domains/authentications/authentication-repository.js").AuthenticationRepository} authenticationRepository
   */
	constructor(authenticationRepository) {
		this.#authenticationRepository = authenticationRepository;
	}

	/**
   * @param {{ refreshToken?: unknown }} [payload]
   */
	async execute(payload) {
		const {refreshToken} = this.#validatePayload(payload);

		await this.#authenticationRepository.checkTokenAvailability(refreshToken);
		await this.#authenticationRepository.deleteToken(refreshToken);
	}

	/**
   * @param {{ refreshToken?: unknown }} [payload]
   * @returns {{ refreshToken: string }}
   */
	#validatePayload(payload) {
		if (!payload?.refreshToken) {
			throw new Error('USER_LOGOUT_USECASE.NOT_CONTAIN_REFRESH_TOKEN');
		}

		if (typeof payload.refreshToken !== 'string') {
			throw new Error('USER_LOGOUT_USECASE.TYPE_MISMATCH');
		}

		return {refreshToken: payload.refreshToken};
	}
}
