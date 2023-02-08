import {RegisterUser} from '#domains/users/entities/register-user.ts';

import type {UserRepository} from '#domains/users/user-repository.ts';
import type {PasswordHash} from '#applications/security/password-hash.ts';
import type {Payload} from '#domains/users/entities/register-user.ts';
import type {RegisteredUser} from '#domains/users/entities/registered-user.ts';

export class AddUser {
	#userRepository: UserRepository;
	#passwordHash: PasswordHash;

	constructor(userRepository: UserRepository, passwordHash: PasswordHash) {
		this.#userRepository = userRepository;
		this.#passwordHash = passwordHash;
	}

	async execute(payload: Payload): Promise<RegisteredUser> {
		const registerUser = new RegisterUser(payload);

		await this.#userRepository.verifyAvailableUsername(registerUser.username);
		registerUser.password = await this.#passwordHash.hash(registerUser.password);

		return this.#userRepository.addUser(registerUser);
	}
}
