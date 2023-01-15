import {describe, it, expect} from '@jest/globals';

import {CreateReply} from '../create-reply.js';

describe('A CreateReply entity', () => {
	it('should throw an error when the payload doesn\'t contain the required properties', () => {
		const payload = {};

		expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', async () => {
		const payload = {
			content: 123,
		};

		expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.TYPE_MISMATCH');
	});

	it('should create \'create reply\' object successfully', () => {
		const payload = {
			content: 'a reply comment',
		};

		const createReply = new CreateReply(payload);

		expect(createReply.content).toEqual(payload.content);
	});
});
