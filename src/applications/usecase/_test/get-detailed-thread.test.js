import {describe, it, expect, jest} from '@jest/globals';

import {ThreadRepository} from '#domains/threads/thread-repository.js';
import {DetailedThread} from '#domains/threads/entities/detailed-thread.js';
import {GetDetailedThread} from '../get-detailed-thread.js';

/**
 * @template T
 * @typedef {import("@jest/globals").jest.MockedFunction<T>} MockedFunction
 */

describe('GetDetailedThread usecase', () => {
	it('should orchestrate the get detailed thread usecase correctly', async () => {
		const threadId = 'thread-123';
		const expectedDetailedThread = new DetailedThread({
			id: threadId,
			title: 'a thread',
			body: 'thread body',
			date: '2022-08-08T08:10:29.775Z',
			username: 'dicoding',
			comments: [
				{
					id: 'comment-123',
					username: 'alice',
					date: '2022-08-08T10:00:11.775Z',
					content: 'a comment',
				},
				{
					id: 'comment-345',
					username: 'bob',
					date: '2022-08-08T12:30:22.775Z',
					content: '**this comment has been deleted**',
				},
			],
		});
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.getDetailedThread
      = /** @type {MockedFunction<typeof mockThreadRepository.getDetailedThread>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(expectedDetailedThread)));

		const getDetailedThread = new GetDetailedThread(mockThreadRepository);

		const detailedThread = await getDetailedThread.execute(threadId);

		expect(detailedThread).toStrictEqual(expectedDetailedThread);
		expect(mockThreadRepository.getDetailedThread).toHaveBeenCalledWith(threadId);
	});
});
