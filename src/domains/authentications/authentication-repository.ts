export class AuthenticationRepository {
	async addToken(_token: string): Promise<void> {
		throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async checkTokenAvailability(_token: string): Promise<void> {
		throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async deleteToken(_token: string): Promise<void> {
		throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}
