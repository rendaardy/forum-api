import {describe, it, expect} from '@jest/globals';

import {DetailedComment} from '../detailed-comment.js';

describe('A DetailedComment entity', () => {
	it('should throw an error when the payload doesn\'t contain the required properties', () => {
		const payload = {
			id: 'comment-123',
			username: 'dicoding',
		};

		expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			id: 'comment-123',
			username: 123,
			date: true,
			content: null,
		};

		expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.TYPE_MISMATCH');
	});

	it('should create \'DetailedComment\' object correctly', () => {
		const payload = {
			id: 'comment-123',
			username: 'dicoding',
			date: '2021-08-08T07:22:33.555Z',
			content: 'a comment',
		};

		const {id, username, date, content} = new DetailedComment(payload);

		expect(id).toEqual(payload.id);
		expect(username).toEqual(payload.username);
		expect(date).toEqual(payload.date);
		expect(content).toEqual(payload.content);
	});
});
