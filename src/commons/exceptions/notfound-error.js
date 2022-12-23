import {ClientError} from './client-error.js';

export class NotFoundError extends ClientError {
	name;

	/**
   * @param {string} message
   */
	constructor(message) {
		super(message, 404);

		this.name = 'NotFoundError';
	}
}
