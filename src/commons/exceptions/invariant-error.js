import {ClientError} from './client-error.js';

export class InvariantError extends ClientError {
	name;

	/**
   * @param {string} message
   */
	constructor(message) {
		super(message);

		this.name = 'InvariantError';
	}
}
