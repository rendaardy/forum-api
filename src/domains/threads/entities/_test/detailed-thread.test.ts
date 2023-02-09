import {describe, it, expect} from '@jest/globals';

import {DetailedThread} from '../detailed-thread.ts';
import {DetailedComment} from '../detailed-comment.ts';

describe('A DetailedThread entity', () => {
	it('should throw an error when the payload doesn\'t contain the required properties', () => {
		const payload = {
			id: 'thread-123',
			title: 'a thread',
			date: new Date(),
			username: 'dicoding',
		};

		expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			id: 'thread-123',
			title: 123,
			body: 'thread body',
			date: false,
			username: 'dicoding',
			comments: ['a comment'],
		};

		expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.TYPE_MISMATCH');
	});

	it('should throw an error when the comments array item doesn\'t contain the required properties', () => {
		const payload = {
			id: 'thread-123',
			title: 'a thread',
			body: 'thread body',
			date: new Date(),
			username: 'dicoding',
			comments: [
				{
					id: 'comment-123',
					date: new Date(),
					content: 'a comment',
				},
			],
		};

		expect(() => new DetailedThread(payload)).toThrowError('DETAILED_COMMENT.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the comments array item has type mismatch', () => {
		const payload = {
			id: 'thread-123',
			title: 'a thread',
			body: 'thread body',
			date: new Date(),
			username: 'dicoding',
			comments: [
				{
					id: false,
					username: 123,
					date: new Date(),
					content: 'a comment',
					replies: [],
				},
			],
		};

		expect(() => new DetailedThread(payload)).toThrowError('DETAILED_COMMENT.TYPE_MISMATCH');
	});

	it('should create \'DetailedThread\' object successfully', () => {
		const payload = {
			id: 'thread-123',
			title: 'a thread',
			body: 'thread body',
			date: new Date(),
			username: 'dicoding',
			comments: [
				{
					id: 'comment-123',
					username: 'johndoe',
					date: new Date(),
					content: 'a comment',
					replies: [
						{
							id: 'reply-123',
							username: 'janedoe',
							date: new Date(),
							content: 'a reply comment',
						},
					],
				},
			],
		};

		const detailedThread = new DetailedThread(payload);

		expect(detailedThread.id).toEqual(payload.id);
		expect(detailedThread.title).toEqual(payload.title);
		expect(detailedThread.body).toEqual(payload.body);
		expect(detailedThread.date).toEqual(payload.date);
		expect(detailedThread.username).toEqual(payload.username);
		expect(detailedThread.comments).toEqual(payload.comments);

		for (const [i, comment] of Object.entries(detailedThread.comments)) {
			expect(comment).toBeInstanceOf(DetailedComment);
			expect(comment.id).toEqual(payload.comments[Number(i)].id);
			expect(comment.date).toEqual(payload.comments[Number(i)].date);
			expect(comment.content).toEqual(payload.comments[Number(i)].content);
			expect(comment.username).toEqual(payload.comments[Number(i)].username);
		}
	});
});
