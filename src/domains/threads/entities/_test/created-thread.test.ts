import {describe, it, expect} from '@jest/globals';

import {CreatedThread} from '../created-thread.ts';

describe('A CreatedThread entity', () => {
	it('should throw an error when the payload doesn\'t contain the required properties', () => {
		const payload = {
			title: 'a thread',
			owner: 'dicoding',
		};

		expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			id: 123,
			title: 'a thread',
			owner: false,
		};

		expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.TYPE_MISMATCH');
	});

	it('should create \'CreatedThread\' object successfully', () => {
		const payload = {
			id: 'thread-123',
			title: 'a thread',
			owner: 'dicoding',
		};

		const {id, title, owner} = new CreatedThread(payload);

		expect(id).toEqual(payload.id);
		expect(title).toEqual(payload.title);
		expect(owner).toEqual(payload.owner);
	});
});
