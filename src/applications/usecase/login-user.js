import {UserLogin} from '#domains/users/entities/user-login.js';
import {NewAuth} from '#domains/authentications/entities/new-auth.js';

/**
 * @typedef {object} Payload
 * @property {string} username
 * @property {string} password
 */

export class LoginUser {
	#userRepository;
	#authenticationRepository;
	#authTokenManager;
	#passwordHash;

	/**
   * @param {import("#domains/users/user-repository.js").UserRepository} userRepository
   * @param {import("#domains/authentications/authentication-repository.js").AuthenticationRepository} authenticationRepository
   * @param {import("#applications/security/auth-token-manager.js").AuthTokenManager} authTokenManager
   * @param {import("#applications/security/password-hash.js").PasswordHash} passwordHash
   */
	constructor(
		userRepository,
		authenticationRepository,
		authTokenManager,
		passwordHash,
	) {
		this.#userRepository = userRepository;
		this.#authenticationRepository = authenticationRepository;
		this.#authTokenManager = authTokenManager;
		this.#passwordHash = passwordHash;
	}

	/**
   * @param {Payload} payload
   * @returns {Promise<NewAuth>}
   */
	async execute(payload) {
		const {username, password} = new UserLogin(payload);
		const encryptedPassword = await this.#userRepository.getPasswordByUsername(username);

		await this.#passwordHash.compare(password, encryptedPassword);

		const id = await this.#userRepository.getIdByUsername(username);
		const accessToken = await this.#authTokenManager.createAccessToken({id, username});
		const refreshToken = await this.#authTokenManager.createRefreshToken({id, username});
		const newAuth = new NewAuth({accessToken, refreshToken});

		await this.#authenticationRepository.addToken(newAuth.refreshToken);

		return newAuth;
	}
}
