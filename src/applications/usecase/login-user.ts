import {UserLogin} from '#domains/users/entities/user-login.ts';
import {NewAuth} from '#domains/authentications/entities/new-auth.ts';

import type {UserRepository} from '#domains/users/user-repository.ts';
import type {AuthenticationRepository} from '#domains/authentications/authentication-repository.ts';
import type {AuthTokenManager} from '#applications/security/auth-token-manager.ts';
import type {PasswordHash} from '#applications/security/password-hash.ts';

type Payload = {
	username?: unknown;
	password?: unknown;
};

export class LoginUser {
	#userRepository: UserRepository;
	#authenticationRepository: AuthenticationRepository;
	#authTokenManager: AuthTokenManager;
	#passwordHash: PasswordHash;

	constructor(
		userRepository: UserRepository,
		authenticationRepository: AuthenticationRepository,
		authTokenManager: AuthTokenManager,
		passwordHash: PasswordHash,
	) {
		this.#userRepository = userRepository;
		this.#authenticationRepository = authenticationRepository;
		this.#authTokenManager = authTokenManager;
		this.#passwordHash = passwordHash;
	}

	async execute(payload: Payload): Promise<NewAuth> {
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
