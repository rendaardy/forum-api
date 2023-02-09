import {ClientError} from './client-error.ts';

export class NotFoundError extends ClientError {
	name: string;

	constructor(message: string) {
		super(message, 404);

		this.name = 'NotFoundError';
	}
}
