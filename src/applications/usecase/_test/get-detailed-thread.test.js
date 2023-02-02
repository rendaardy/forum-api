import {describe, it, expect, jest} from '@jest/globals';

import {ThreadRepository} from '#domains/threads/thread-repository.js';
import {CommentRepository} from '#domains/threads/comment-repository.js';
import {ReplyRepository} from '#domains/threads/reply-repository.js';
import {DetailedThread} from '#domains/threads/entities/detailed-thread.js';
import {DetailedComment} from '#domains/threads/entities/detailed-comment.js';
import {DetailedReply} from '#domains/threads/entities/detailed-reply.js';
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
			date: new Date(2022, 11, 10, 10, 15, 16),
			username: 'dicoding',
			comments: [
				{
					id: 'comment-123',
					username: 'alice',
					date: new Date(2022, 11, 11, 20, 30, 10),
					content: 'a comment',
					replies: [
						{
							id: 'reply-123',
							username: 'bob',
							date: new Date(2022, 11, 12, 16, 17, 20),
							content: 'a reply comment',
						},
					],
				},
				{
					id: 'comment-345',
					username: 'bob',
					date: new Date(2022, 11, 11, 23, 0, 5),
					content: 'a comment 2',
					replies: [],
				},
			],
		});
		const mockThreadRepository = new ThreadRepository();
		const mockCommentRepository = new CommentRepository();
		const mockReplyRepository = new ReplyRepository();

		mockThreadRepository.getDetailedThread
        = /** @type {MockedFunction<typeof mockThreadRepository.getDetailedThread>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(new DetailedThread({
					id: threadId,
					title: 'a thread',
					body: 'thread body',
					date: new Date(2022, 11, 10, 10, 15, 16),
					username: 'dicoding',
					comments: [],
				}))));
		mockCommentRepository.getAllDetailedCommentsFromThread
        = /** @type {MockedFunction<typeof mockCommentRepository.getAllDetailedCommentsFromThread>} */(jest.fn()
				.mockImplementation(() => Promise.resolve([
					new DetailedComment({
						id: 'comment-123',
						username: 'alice',
						date: new Date(2022, 11, 11, 20, 30, 10),
						content: 'a comment',
						replies: [],
					}),
					new DetailedComment({
						id: 'comment-345',
						username: 'bob',
						date: new Date(2022, 11, 11, 23, 0, 5),
						content: 'a comment 2',
						replies: [],
					}),
				])));
		mockReplyRepository.getAllDetailedRepliesFromComment
        = /** @type {MockedFunction<typeof mockReplyRepository.getAllDetailedRepliesFromComment>} */(jest.fn()
				.mockImplementation(() => Promise.resolve([
					'comment-123',
					[
						new DetailedReply({
							id: 'reply-123',
							username: 'bob',
							date: new Date(2022, 11, 12, 16, 17, 20),
							content: 'a reply comment',
						}),
					],
				])));

		const getDetailedThread = new GetDetailedThread(
			mockThreadRepository,
			mockCommentRepository,
			mockReplyRepository,
		);

		const detailedThread = await getDetailedThread.execute(threadId);

		expect(detailedThread).toStrictEqual(expectedDetailedThread);
		expect(mockThreadRepository.getDetailedThread).toHaveBeenCalledWith(threadId);
		expect(mockCommentRepository.getAllDetailedCommentsFromThread).toHaveBeenCalledWith(threadId);
		expect(mockReplyRepository.getAllDetailedRepliesFromComment).toHaveBeenCalledTimes(2);
	});
});
