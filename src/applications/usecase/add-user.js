import {RegisterUser} from '#domains/users/entities/register-user.js';

export class AddUser {
	#userRepository;
	#passwordHash;

	/**
   * @param {import("#domains/users/user-repository.js").UserRepository} userRepository
   * @param {import("#applications/security/password-hash.js").PasswordHash} passwordHash
   */
	constructor(userRepository, passwordHash) {
		this.#userRepository = userRepository;
		this.#passwordHash = passwordHash;
	}

	/**
   * @param {import("#domains/users/entities/register-user.js").Payload} payload
   * @returns {Promise<import("#domains/users/entities/registered-user.js").RegisteredUser>}
   */
	async execute(payload) {
		const registerUser = new RegisterUser(payload);

		await this.#userRepository.verifyAvailableUsername(registerUser.username);
		registerUser.password = await this.#passwordHash.hash(registerUser.password);

		return this.#userRepository.addUser(registerUser);
	}
}
