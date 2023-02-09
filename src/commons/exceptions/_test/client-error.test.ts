import {describe, it, expect} from '@jest/globals';

import {ClientError} from '../client-error.ts';

describe('ClientError', () => {
	it('should throw an error when the abstract class is instantiated', () => {
		expect(() => new ClientError('')).toThrowError('cannot instantiate abstract class');
	});
});
