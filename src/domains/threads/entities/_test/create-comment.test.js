import {describe, it, expect} from '@jest/globals';

import {CreateComment} from '../create-comment.js';

describe('A CreateComment entity', () => {
	it('should throw an error when the payload doesn\'t contain the required properties', () => {
		const payload = {};

		expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			content: 123,
		};

		expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.TYPE_MISMATCH');
	});

	it('should create \'CreateComment\' object successfully', () => {
		const payload = {
			content: 'a comment',
		};

		const {content} = new CreateComment(payload);

		expect(content).toEqual(payload.content);
	});
});
