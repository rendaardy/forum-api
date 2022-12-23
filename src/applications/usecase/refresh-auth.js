export class RefreshAuth {
	#authenticationRepository;
	#authTokenManager;

	/**
   * @param {import("#domains/authentications/authentication-repository.js").AuthenticationRepository} authenticationRepository
   * @param {import("#applications/security/auth-token-manager.js").AuthTokenManager} authTokenManager
   */
	constructor(authenticationRepository, authTokenManager) {
		this.#authenticationRepository = authenticationRepository;
		this.#authTokenManager = authTokenManager;
	}

	/**
   * @param {{ refreshToken?: unknown }} [payload]
   */
	async execute(payload) {
		const {refreshToken} = this.#validatePayload(payload);

		await this.#authTokenManager.verifyRefreshToken(refreshToken);
		await this.#authenticationRepository.checkTokenAvailability(refreshToken);

		const {id, username} = await this.#authTokenManager.decodePayload(refreshToken);

		return this.#authTokenManager.createAccessToken({id, username});
	}

	/**
   * @param {{ refreshToken?: unknown }} [payload]
   * @returns {{ refreshToken: string }}
   */
	#validatePayload(payload) {
		if (!payload?.refreshToken) {
			throw new Error('REFRESH_AUTHENTICATION_USECASE.NOT_CONTAIN_REFRESH_TOKEN');
		}

		if (typeof payload.refreshToken !== 'string') {
			throw new Error('REFRESH_AUTHENTICATION_USECASE.TYPE_MISMATCH');
		}

		return {refreshToken: payload.refreshToken};
	}
}
