import type {AuthenticationRepository} from '#domains/authentications/authentication-repository.ts';
import type {AuthTokenManager} from '#applications/security/auth-token-manager.ts';

type Payload = {
	refreshToken?: unknown;
};

export class RefreshAuth {
	#authenticationRepository: AuthenticationRepository;
	#authTokenManager: AuthTokenManager;

	constructor(authenticationRepository: AuthenticationRepository, authTokenManager: AuthTokenManager) {
		this.#authenticationRepository = authenticationRepository;
		this.#authTokenManager = authTokenManager;
	}

	async execute(payload: Payload): Promise<string> {
		const {refreshToken} = this.#validatePayload(payload);

		await this.#authTokenManager.verifyRefreshToken(refreshToken);
		await this.#authenticationRepository.checkTokenAvailability(refreshToken);

		/* eslint-disable @typescript-eslint/no-unsafe-assignment */
		const {id, username} = await this.#authTokenManager.decodePayload(refreshToken);

		return this.#authTokenManager.createAccessToken({id, username});
		/* eslint-enable @typescript-eslint/no-unsafe-assignment */
	}

	#validatePayload(payload: Payload): {refreshToken: string} {
		if (!payload?.refreshToken) {
			throw new Error('REFRESH_AUTHENTICATION_USECASE.NOT_CONTAIN_REFRESH_TOKEN');
		}

		if (typeof payload.refreshToken !== 'string') {
			throw new Error('REFRESH_AUTHENTICATION_USECASE.TYPE_MISMATCH');
		}

		return {refreshToken: payload.refreshToken};
	}
}
