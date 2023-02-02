import {describe, it, expect, jest} from '@jest/globals';

import {ReplyRepository} from '#domains/threads/reply-repository.js';
import {CommentRepository} from '#domains/threads/comment-repository.js';
import {ThreadRepository} from '#domains/threads/thread-repository.js';
import {RemoveReply} from '../remove-reply.js';

/**
 * @template T
 * @typedef {import("@jest/globals").jest.MockedFunction<T>} MockedFunction
 */

describe('RemoveReply usecase', () => {
	it('should orchestrate the remove reply correctly', async () => {
		const userId = 'user-123';
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const replyId = 'reply-234';
		const mockReplyRepository = new ReplyRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.threadExists
        = /** @type {MockedFunction<typeof mockThreadRepository.threadExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(true)));
		mockCommentRepository.commentExists
        = /** @type {MockedFunction<typeof mockCommentRepository.commentExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(true)));
		mockReplyRepository.verifyReplyOwner
        = /** @type {MockedFunction<typeof mockReplyRepository.verifyReplyOwner>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve()));
		mockReplyRepository.removeReply
		= /** @type {MockedFunction<typeof mockReplyRepository.removeReply>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve()));

		const removeReply = new RemoveReply(
			mockThreadRepository,
			mockCommentRepository,
			mockReplyRepository,
		);

		await removeReply.execute(userId, threadId, commentId, replyId);

		expect(mockThreadRepository.threadExists).toHaveBeenCalledWith(threadId);
		expect(mockCommentRepository.commentExists).toHaveBeenCalledWith(commentId);
		expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(userId, replyId);
		expect(mockReplyRepository.removeReply).toHaveBeenCalledWith(replyId);
	});

	it('should throw an error when thread doesn\'t exist', async () => {
		const userId = 'user-123';
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const replyId = 'reply-234';
		const mockReplyRepository = new ReplyRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.threadExists
        = /** @type {MockedFunction<typeof mockThreadRepository.threadExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(false)));
		mockCommentRepository.commentExists
        = /** @type {MockedFunction<typeof mockCommentRepository.commentExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(true)));
		jest.spyOn(mockReplyRepository, 'verifyReplyOwner');
		jest.spyOn(mockReplyRepository, 'removeReply');

		const removeReply = new RemoveReply(
			mockThreadRepository,
			mockCommentRepository,
			mockReplyRepository,
		);

		await expect(() => removeReply.execute(userId, threadId, commentId, replyId))
			.rejects.toThrowError('Failed to remove a reply. Thread not found');
		expect(mockThreadRepository.threadExists).toHaveBeenCalledWith(threadId);
		expect(mockReplyRepository.verifyReplyOwner).not.toHaveBeenCalled();
		expect(mockReplyRepository.removeReply).not.toHaveBeenCalled();
	});

	it('should throw an error when comment doesn\'t exist', async () => {
		const userId = 'user-123';
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const replyId = 'reply-234';
		const mockReplyRepository = new ReplyRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.threadExists
        = /** @type {MockedFunction<typeof mockThreadRepository.threadExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(true)));
		mockCommentRepository.commentExists
        = /** @type {MockedFunction<typeof mockCommentRepository.commentExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(false)));
		jest.spyOn(mockReplyRepository, 'verifyReplyOwner');
		jest.spyOn(mockReplyRepository, 'removeReply');

		const removeReply = new RemoveReply(
			mockThreadRepository,
			mockCommentRepository,
			mockReplyRepository,
		);

		await expect(() => removeReply.execute(userId, threadId, commentId, replyId))
			.rejects.toThrowError('Failed to remove a reply. Comment not found');
		expect(mockCommentRepository.commentExists).toHaveBeenCalledWith(commentId);
		expect(mockReplyRepository.verifyReplyOwner).not.toHaveBeenCalled();
		expect(mockReplyRepository.removeReply).not.toHaveBeenCalled();
	});
});
