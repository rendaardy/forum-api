/**
 * @interface PasswordHash
 */
export class PasswordHash {
	/**
   * @param {string} _password
   * @returns {Promise<string>}
   */
	async hash(_password) {
		throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
	}

	/**
   * @param {string} _plain
   * @param {string} _encrypted
   */
	async compare(_plain, _encrypted) {
		throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
	}
}
