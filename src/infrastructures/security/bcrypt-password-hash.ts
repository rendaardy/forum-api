import {PasswordHash} from '#applications/security/password-hash.ts';
import {AuthenticationError} from '#commons/exceptions/authentication-error.ts';

import type bcryptJs from 'bcrypt';

export class BcryptPasswordHash extends PasswordHash {
	#bcrypt: typeof bcryptJs;
	#saltRound: number;

	constructor(bcrypt: typeof bcryptJs, saltRound = 10) {
		super();

		this.#bcrypt = bcrypt;
		this.#saltRound = saltRound;
	}

	async hash(password: string): Promise<string> {
		return this.#bcrypt.hash(password, this.#saltRound);
	}

	async compare(plainPassword: string, encryptedPassword: string): Promise<void> {
		const result = await this.#bcrypt.compare(plainPassword, encryptedPassword);

		if (!result) {
			throw new AuthenticationError('Password does not match');
		}
	}
}
