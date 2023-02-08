import {ClientError} from './client-error.ts';

export class InvariantError extends ClientError {
	name: string;

	constructor(message: string) {
		super(message);

		this.name = 'InvariantError';
	}
}
