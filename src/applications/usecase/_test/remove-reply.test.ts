import {describe, it, expect, jest} from '@jest/globals';

import {ReplyRepository} from '#domains/threads/reply-repository.ts';
import {CommentRepository} from '#domains/threads/comment-repository.ts';
import {ThreadRepository} from '#domains/threads/thread-repository.ts';
import {RemoveReply} from '../remove-reply.ts';

describe('RemoveReply usecase', () => {
	it('should orchestrate the remove reply correctly', async () => {
		const userId = 'user-123';
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const replyId = 'reply-234';
		const mockReplyRepository = new ReplyRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockCommentRepository.commentExists = jest.fn<typeof mockCommentRepository.commentExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockReplyRepository.verifyReplyOwner = jest.fn<typeof mockReplyRepository.verifyReplyOwner>()
			.mockImplementation(async () => Promise.resolve());
		mockReplyRepository.removeReply = jest.fn<typeof mockReplyRepository.removeReply>()
			.mockImplementation(async () => Promise.resolve());

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

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(false));
		mockCommentRepository.commentExists = jest.fn<typeof mockCommentRepository.commentExists>()
			.mockImplementation(async () => Promise.resolve(true));
		jest.spyOn(mockReplyRepository, 'verifyReplyOwner');
		jest.spyOn(mockReplyRepository, 'removeReply');

		const removeReply = new RemoveReply(
			mockThreadRepository,
			mockCommentRepository,
			mockReplyRepository,
		);

		await expect(async () => removeReply.execute(userId, threadId, commentId, replyId))
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

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockCommentRepository.commentExists = jest.fn<typeof mockCommentRepository.commentExists>()
			.mockImplementation(async () => Promise.resolve(false));
		jest.spyOn(mockReplyRepository, 'verifyReplyOwner');
		jest.spyOn(mockReplyRepository, 'removeReply');

		const removeReply = new RemoveReply(
			mockThreadRepository,
			mockCommentRepository,
			mockReplyRepository,
		);

		await expect(async () => removeReply.execute(userId, threadId, commentId, replyId))
			.rejects.toThrowError('Failed to remove a reply. Comment not found');
		expect(mockCommentRepository.commentExists).toHaveBeenCalledWith(commentId);
		expect(mockReplyRepository.verifyReplyOwner).not.toHaveBeenCalled();
		expect(mockReplyRepository.removeReply).not.toHaveBeenCalled();
	});
});
