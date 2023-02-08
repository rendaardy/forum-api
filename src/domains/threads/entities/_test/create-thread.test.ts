import {describe, it, expect} from '@jest/globals';

import {CreateThread} from '../create-thread.ts';

describe('A CreateThread entity', () => {
	it('should throw an error when the payload doesn\'t contain the required properties', () => {
		const payload = {
			body: 'thread body',
		};

		expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_REQUIRED_PROPERTIES');
	});

	it('should throw an error when the payload has type mismatch', () => {
		const payload = {
			title: 'a thread',
			body: true,
		};

		expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.TYPE_MISMATCH');
	});

	it('should create \'CreateThread\' object successfully', () => {
		const payload = {
			title: 'a thread',
			body: 'thread body',
		};

		const {title, body} = new CreateThread(payload);

		expect(title).toEqual(payload.title);
		expect(body).toEqual(payload.body);
	});
});
