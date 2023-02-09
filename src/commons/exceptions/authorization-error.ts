import {ClientError} from './client-error.ts';

export class AuthorizationError extends ClientError {
	name: string;

	constructor(message: string) {
		super(message, 403);

		this.name = 'AuthorizationError';
	}
}
