import {describe, it, expect, jest} from '@jest/globals';

import {ThreadRepository} from '#domains/threads/thread-repository.js';
import {CreateThread} from '#domains/threads/entities/create-thread.js';
import {CreatedThread} from '#domains/threads/entities/created-thread.js';
import {AddThread} from '../add-thread.js';

/**
 * @template T
 * @typedef {import("@jest/globals").jest.MockedFunction<T>} MockedFunction
 */

describe('AddThread usecase', () => {
	it('should orchestrate the add thread usecase correctly', async () => {
		const payload = {
			title: 'a thread',
			body: 'a thread body',
		};
		const userId = 'user-123';
		const expectedCreatedThread = new CreatedThread({
			id: 'thread-123',
			title: 'a thread',
			owner: 'user-123',
		});
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.addThread
      = /** @type {MockedFunction<typeof mockThreadRepository.addThread>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(new CreatedThread({
					id: 'thread-123',
					title: 'a thread',
					owner: 'user-123',
				}))));

		const addThread = new AddThread(mockThreadRepository);

		const createdThread = await addThread.execute(userId, payload);

		expect(createdThread).toStrictEqual(expectedCreatedThread);
		expect(mockThreadRepository.addThread).toHaveBeenCalledWith(userId, new CreateThread({
			title: payload.title,
			body: payload.body,
		}));
	});
});
