import {describe, it, expect} from '@jest/globals';

import {DetailedComment} from '../detailed-comment.ts';
import {DetailedReply} from '../detailed-reply.ts';

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
			likeCount: '2',
			replies: [],
		};

		expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.TYPE_MISMATCH');
	});

	it('should throw an error when the replies array item doesn\'t contain the required properties', () => {
		const payload = {
			id: 'comment-123',
			username: 'dicoding',
			date: new Date(),
			content: 'a comment',
			likeCount: 2,
			replies: [
				{
					id: 'reply-xxx',
					date: new Date(),
				},
			],
		};

		expect(() => new DetailedComment(payload)).toThrowError('DETAILED_REPLY.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the replies array item has type mismatch', () => {
		const payload = {
			id: 'comment-123',
			username: 'dicoding',
			date: new Date(),
			content: 'a comment',
			likeCount: 2,
			replies: [
				{
					id: 'reply-xx',
					username: 123,
					date: true,
					content: 'a reply comment',
				},
			],
		};

		expect(() => new DetailedComment(payload)).toThrowError('DETAILED_REPLY.TYPE_MISMATCH');
	});

	it('should create \'DetailedComment\' object correctly', () => {
		const payload = {
			id: 'comment-123',
			username: 'dicoding',
			date: new Date(),
			content: 'a comment',
			likeCount: 2,
			replies: [
				{
					id: 'reply-xxx',
					username: 'alice',
					date: new Date(),
					content: 'a reply comment',
				},
			],
		};

		const {id, username, date, content, likeCount, replies} = new DetailedComment(payload);

		expect(id).toEqual(payload.id);
		expect(username).toEqual(payload.username);
		expect(date).toEqual(payload.date);
		expect(content).toEqual(payload.content);
		expect(likeCount).toEqual(payload.likeCount);
		expect(replies).toEqual(payload.replies);

		for (const [i, reply] of Object.entries(replies)) {
			expect(reply).toBeInstanceOf(DetailedReply);
			expect(reply.id).toEqual(payload.replies[Number(i)].id);
			expect(reply.username).toEqual(payload.replies[Number(i)].username);
			expect(reply.date).toEqual(payload.replies[Number(i)].date);
			expect(reply.content).toEqual(payload.replies[Number(i)].content);
		}
	});

	it('should create \'DetailedComment\' object with content that show a removed message', () => {
		const payload = {
			id: 'comment-123',
			username: 'dicoding',
			date: new Date(),
			content: 'a comment',
			likeCount: 2,
			isDeleted: true,
			replies: [
				{
					id: 'reply-xxx',
					username: 'alice',
					date: new Date(),
					content: 'a reply comment',
				},
			],
		};

		const {id, username, date, content, likeCount, replies} = new DetailedComment(payload);

		expect(id).toEqual(payload.id);
		expect(username).toEqual(payload.username);
		expect(date).toEqual(payload.date);
		expect(content).toEqual('**komentar telah dihapus**');
		expect(likeCount).toEqual(payload.likeCount);
		expect(replies).toEqual(payload.replies);

		for (const [i, reply] of Object.entries(replies)) {
			expect(reply).toBeInstanceOf(DetailedReply);
			expect(reply.id).toEqual(payload.replies[Number(i)].id);
			expect(reply.username).toEqual(payload.replies[Number(i)].username);
			expect(reply.date).toEqual(payload.replies[Number(i)].date);
			expect(reply.content).toEqual(payload.replies[Number(i)].content);
		}
	});
});
