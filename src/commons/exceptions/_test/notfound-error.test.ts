import {describe, it, expect} from '@jest/globals';

import {NotFoundError} from '../notfound-error.ts';

describe('NotFoundError', () => {
	it('should be instantiated correctly', () => {
		const notFoundError = new NotFoundError('not found!');

		expect(notFoundError.statusCode).toEqual(404);
		expect(notFoundError.message).toEqual('not found!');
		expect(notFoundError.name).toEqual('NotFoundError');
	});
});
