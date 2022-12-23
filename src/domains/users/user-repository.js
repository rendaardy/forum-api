/**
 * @interface UserRepository
 */
export class UserRepository {
	/**
   * @param {import("#domains/users/entities/register-user.js").RegisterUser} _registerUser
   * @returns {Promise<import("#domains/users/entities/registered-user.js").RegisteredUser>}
   */
	async addUser(_registerUser) {
		throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
   * @param {string} _username
   */
	async verifyAvailableUsername(_username) {
		throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
   * @param {string} _username
   * @returns {Promise<string>}
   */
	async getPasswordByUsername(_username) {
		throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
   * @param {string} _username
   * @returns {Promise<string>}
   */
	async getIdByUsername(_username) {
		throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}
