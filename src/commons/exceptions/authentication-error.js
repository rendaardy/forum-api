import {ClientError} from './client-error.js';

export class AuthenticationError extends ClientError {
	name;

	/**
   * @param {string} message
   */
	constructor(message) {
		super(message, 401);

		this.name = 'AuthenticationError';
	}
}
