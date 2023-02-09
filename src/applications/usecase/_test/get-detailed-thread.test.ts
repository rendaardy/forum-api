import {describe, it, expect, jest} from '@jest/globals';

import {ThreadRepository} from '#domains/threads/thread-repository.ts';
import {CommentRepository} from '#domains/threads/comment-repository.ts';
import {ReplyRepository} from '#domains/threads/reply-repository.ts';
import {DetailedThread} from '#domains/threads/entities/detailed-thread.ts';
import {DetailedComment} from '#domains/threads/entities/detailed-comment.ts';
import {DetailedReply} from '#domains/threads/entities/detailed-reply.ts';
import {GetDetailedThread} from '../get-detailed-thread.ts';

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
					likeCount: 2,
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
					likeCount: 0,
					replies: [],
				},
			],
		});
		const mockThreadRepository = new ThreadRepository();
		const mockCommentRepository = new CommentRepository();
		const mockReplyRepository = new ReplyRepository();

		mockThreadRepository.getDetailedThread = jest
			.fn<typeof mockThreadRepository.getDetailedThread>()
			.mockImplementation(async () => Promise.resolve(new DetailedThread({
				id: threadId,
				title: 'a thread',
				body: 'thread body',
				date: new Date(2022, 11, 10, 10, 15, 16),
				username: 'dicoding',
				comments: [],
			})));
		mockCommentRepository.getAllDetailedCommentsFromThread = jest
			.fn<typeof mockCommentRepository.getAllDetailedCommentsFromThread>()
			.mockImplementation(async () => Promise.resolve([
				new DetailedComment({
					id: 'comment-123',
					username: 'alice',
					date: new Date(2022, 11, 11, 20, 30, 10),
					content: 'a comment',
					likeCount: 2,
					replies: [],
				}),
				new DetailedComment({
					id: 'comment-345',
					username: 'bob',
					date: new Date(2022, 11, 11, 23, 0, 5),
					content: 'a comment 2',
					likeCount: 0,
					replies: [],
				}),
			]));
		mockReplyRepository.getAllDetailedRepliesFromComment = jest
			.fn<typeof mockReplyRepository.getAllDetailedRepliesFromComment>()
			.mockImplementation(async () => Promise.resolve([
				'comment-123',
				[
					new DetailedReply({
						id: 'reply-123',
						username: 'bob',
						date: new Date(2022, 11, 12, 16, 17, 20),
						content: 'a reply comment',
					}),
				],
			]));
		mockCommentRepository.getTotalCommentLikesById = jest
			.fn<typeof mockCommentRepository.getTotalCommentLikesById>()
			.mockImplementation(async commentId => commentId === 'comment-123'
				? Promise.resolve(['comment-123', 2])
				: Promise.resolve(['comment-345', 0]));

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
		expect(mockCommentRepository.getTotalCommentLikesById).toHaveBeenCalledTimes(2);
	});
});
