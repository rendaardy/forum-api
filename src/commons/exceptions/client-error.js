export class ClientError extends Error {
	name;
	statusCode;

	/**
   * @param {string} message
   * @param {number} [statusCode]
   */
	constructor(message, statusCode = 400) {
		super(message);

		if (this.constructor.name === 'ClientError') {
			throw new Error('cannot instantiate abstract class');
		}

		this.statusCode = statusCode;
		this.name = 'ClientError';
	}
}
