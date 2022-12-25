import {describe, it, expect, jest} from '@jest/globals';

import {UserRepository} from '#domains/users/user-repository.js';
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
		const username = 'dicoding';
		const expectedCreatedThread = new CreatedThread({
			id: 'thread-123',
			title: 'a thread',
			owner: 'user-123',
		});
		const expectedUserId = 'user-123';
		const mockUserRepository = new UserRepository();
		const mockThreadRepository = new ThreadRepository();

		mockUserRepository.getIdByUsername
      = /** @type {MockedFunction<typeof mockUserRepository.getIdByUsername>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(expectedUserId)));
		mockThreadRepository.addThread
      = /** @type {MockedFunction<typeof mockThreadRepository.addThread>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(expectedCreatedThread)));

		const addThread = new AddThread(mockUserRepository, mockThreadRepository);

		const createdThread = await addThread.execute(username, payload);

		expect(createdThread).toStrictEqual(expectedCreatedThread);
		expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith(username);
		expect(mockThreadRepository.addThread).toHaveBeenCalledWith(expectedUserId, new CreateThread({
			title: payload.title,
			body: payload.body,
		}));
	});
});
