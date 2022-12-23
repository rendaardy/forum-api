export class AuthenticationRepository {
	/**
   * @param {string} _token
   */
	async addToken(_token) {
		throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
   * @param {string} _token
   */
	async checkTokenAvailability(_token) {
		throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
   * @param {string} _token
   */
	async deleteToken(_token) {
		throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}
