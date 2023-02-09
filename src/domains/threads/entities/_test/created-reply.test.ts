import {describe, it, expect} from '@jest/globals';

import {CreatedReply} from '../created-reply.ts';

describe('A CreatedReply entity', () => {
	it('should throw an error when the payload doesn\'t contain the required properties', () => {
		const payload = {
			id: 'reply-xxx',
			owner: 'user-xxx',
		};

		expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			id: 'reply-xxx',
			content: 123,
			owner: 'user-xxx',
		};

		expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.TYPE_MISMATCH');
	});

	it('shoudl create \'created reply\' object successfully', () => {
		const payload = {
			id: 'reply-xxx',
			content: 'a reply comment',
			owner: 'user-xxx',
		};

		const createdReply = new CreatedReply(payload);

		expect(createdReply.id).toEqual(payload.id);
		expect(createdReply.content).toEqual(payload.content);
		expect(createdReply.owner).toEqual(payload.owner);
	});
});
