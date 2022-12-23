import {PasswordHash} from '#applications/security/password-hash.js';
import {AuthenticationError} from '#commons/exceptions/authentication-error.js';

/**
 * @implements PasswordHash
 */
export class BcryptPasswordHash extends PasswordHash {
	#bcrypt;
	#saltRound;

	/**
   * @param {typeof import("bcrypt")} bcrypt
   * @param {number} [saltRound]
   */
	constructor(bcrypt, saltRound = 10) {
		super();

		this.#bcrypt = bcrypt;
		this.#saltRound = saltRound;
	}

	/**
   * @param {string} password
   * @returns {Promise<string>}
   */
	async hash(password) {
		return this.#bcrypt.hash(password, this.#saltRound);
	}

	/**
   * @param {string} plainPassword
   * @param {string} encryptedPassword
   */
	async compare(plainPassword, encryptedPassword) {
		const result = await this.#bcrypt.compare(plainPassword, encryptedPassword);

		if (!result) {
			throw new AuthenticationError('Password does not match');
		}
	}
}
