import type {AuthenticationRepository} from '#domains/authentications/authentication-repository.ts';

type Payload = {
	refreshToken?: unknown;
};

export class LogoutUser {
	#authenticationRepository: AuthenticationRepository;

	constructor(authenticationRepository: AuthenticationRepository) {
		this.#authenticationRepository = authenticationRepository;
	}

	async execute(payload: Payload): Promise<void> {
		const {refreshToken} = this.#validatePayload(payload);

		await this.#authenticationRepository.checkTokenAvailability(refreshToken);
		await this.#authenticationRepository.deleteToken(refreshToken);
	}

	#validatePayload(payload: Payload): {refreshToken: string} {
		if (!payload.refreshToken) {
			throw new Error('USER_LOGOUT_USECASE.NOT_CONTAIN_REFRESH_TOKEN');
		}

		if (typeof payload.refreshToken !== 'string') {
			throw new Error('USER_LOGOUT_USECASE.TYPE_MISMATCH');
		}

		return {refreshToken: payload.refreshToken};
	}
}
