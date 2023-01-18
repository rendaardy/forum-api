import {describe, it, expect} from '@jest/globals';

import {DetailedReply} from '../detailed-reply.js';

describe('A DetailedReply entity', () => {
	it('should throw an error when the payload doesn\'t contain the required properties', () => {
		const payload = {
			id: 'reply-123',
			username: 'dicoding',
		};

		expect(() => new DetailedReply(payload)).toThrowError('DETAILED_REPLY.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			id: 'reply-123',
			username: 123,
			date: true,
			content: null,
		};

		expect(() => new DetailedReply(payload)).toThrowError('DETAILED_REPLY.TYPE_MISMATCH');
	});

	it('should create \'DetailedReply\' object correctly', () => {
		const payload = {
			id: 'reply-123',
			username: 'dicoding',
			date: new Date(),
			content: 'a reply comment',
		};

		const {id, username, date, content} = new DetailedReply(payload);

		expect(id).toEqual(payload.id);
		expect(username).toEqual(payload.username);
		expect(date).toEqual(payload.date);
		expect(content).toEqual(payload.content);
	});

	it('should create \'DetailedReply\' object with content that show a removed message', () => {
		const payload = {
			id: 'reply-123',
			username: 'dicoding',
			date: new Date(),
			content: 'a reply comment',
			isDeleted: true,
		};

		const {id, username, date, content} = new DetailedReply(payload);

		expect(id).toEqual(payload.id);
		expect(username).toEqual(payload.username);
		expect(date).toEqual(payload.date);
		expect(content).toEqual('**balasan telah dihapus**');
	});
});
