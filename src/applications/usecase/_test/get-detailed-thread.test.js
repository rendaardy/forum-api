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
		const expectedDate = new Date();
		const expectedDetailedThread = new DetailedThread({
			id: threadId,
			title: 'a thread',
			body: 'thread body',
			date: expectedDate,
			username: 'dicoding',
			comments: [
				{
					id: 'comment-123',
					username: 'alice',
					date: expectedDate,
					content: 'a comment',
					replies: [
						{
							id: 'reply-123',
							username: 'bob',
							date: expectedDate,
							content: 'a reply comment',
						},
					],
				},
				{
					id: 'comment-345',
					username: 'bob',
					date: expectedDate,
					content: '**komentar telah dihapus**',
					replies: [],
				},
			],
		});
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.getDetailedThread
      = /** @type {MockedFunction<typeof mockThreadRepository.getDetailedThread>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(new DetailedThread({
					id: threadId,
					title: 'a thread',
					body: 'thread body',
					date: expectedDate,
					username: 'dicoding',
					comments: [
						{
							id: 'comment-123',
							username: 'alice',
							date: expectedDate,
							content: 'a comment',
							isDeleted: false,
							replies: [
								{
									id: 'reply-123',
									username: 'bob',
									date: expectedDate,
									content: 'a reply comment',
									isDeleted: false,
								},
							],
						},
						{
							id: 'comment-345',
							username: 'bob',
							date: expectedDate,
							content: 'a comment 2',
							isDeleted: true,
							replies: [],
						},
					],
				}))));

		const getDetailedThread = new GetDetailedThread(mockThreadRepository);

		const detailedThread = await getDetailedThread.execute(threadId);

		expect(detailedThread).toStrictEqual(expectedDetailedThread);
		expect(mockThreadRepository.getDetailedThread).toHaveBeenCalledWith(threadId);
	});
});
