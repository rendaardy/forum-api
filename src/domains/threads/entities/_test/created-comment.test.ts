import {describe, it, expect} from '@jest/globals';

import {CreatedComment} from '../created-comment.ts';

describe('A CreatedComment entity', () => {
	it('should throw an error when the payload doesn\'t contain the required properties', () => {
		const payload = {
			id: 'comment-123',
			content: 'a comment',
		};

		expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			id: false,
			content: 123,
			owner: '1234',
		};

		expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.TYPE_MISMATCH');
	});

	it('should create \'CreatedComment\' object successfully', () => {
		const payload = {
			id: 'comment-123',
			content: 'a comment',
			owner: 'user-123',
		};

		const {id, content, owner} = new CreatedComment(payload);

		expect(id).toEqual(payload.id);
		expect(content).toEqual(payload.content);
		expect(owner).toEqual(payload.owner);
	});
});
