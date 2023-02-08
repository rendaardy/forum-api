import {ClientError} from './client-error.ts';

export class AuthenticationError extends ClientError {
	name: string;

	constructor(message: string) {
		super(message, 401);

		this.name = 'AuthenticationError';
	}
}
