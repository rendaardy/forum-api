import {ClientError} from './client-error.js';

export class AuthorizationError extends ClientError {
	name;

	/**
   * @param {string} message
   */
	constructor(message) {
		super(message, 403);

		this.name = 'AuthorizationError';
	}
}
