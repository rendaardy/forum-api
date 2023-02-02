import {describe, it, expect, jest} from '@jest/globals';

import {ReplyRepository} from '#domains/threads/reply-repository.js';
import {CommentRepository} from '#domains/threads/comment-repository.js';
import {ThreadRepository} from '#domains/threads/thread-repository.js';
import {CreateReply} from '#domains/threads/entities/create-reply.js';
import {CreatedReply} from '#domains/threads/entities/created-reply.js';
import {AddReply} from '../add-reply.js';

/**
 * @template T
 * @typedef {import("@jest/globals").jest.MockedFunction<T>} MockedFunction
 */

describe('AddReply usecase', () => {
	it('should orchestrate the add reply correctly', async () => {
		const payload = {
			content: 'a comment',
		};
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const userId = 'user-123';
		const expectedCreatedReply = new CreatedReply({
			id: 'reply-123',
			content: 'a reply comment',
			owner: 'user-123',
		});
		const mockReplyRepository = new ReplyRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.threadExists
        = /** @type {MockedFunction<typeof mockThreadRepository.threadExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(true)));
		mockCommentRepository.commentExists
        = /** @type {MockedFunction<typeof mockCommentRepository.commentExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(true)));
		mockReplyRepository.addReply
        = /** @type {MockedFunction<typeof mockReplyRepository.addReply>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(new CreatedReply({
					id: 'reply-123',
					content: 'a reply comment',
					owner: 'user-123',
				}))));

		const addReply = new AddReply(
			mockThreadRepository,
			mockCommentRepository,
			mockReplyRepository,
		);

		const createdComment = await addReply.execute(userId, threadId, commentId, payload);

		expect(createdComment).toStrictEqual(expectedCreatedReply);
		expect(mockThreadRepository.threadExists).toHaveBeenCalledWith(threadId);
		expect(mockCommentRepository.commentExists).toHaveBeenCalledWith(commentId);
		expect(mockReplyRepository.addReply)
			.toHaveBeenCalledWith(userId, commentId, new CreateReply({
				content: payload.content,
			}));
	});

	it('should throw an error when thread doesn\'t exist', async () => {
		const payload = {
			content: 'a comment',
		};
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const userId = 'user-123';
		const mockReplyRepository = new ReplyRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.threadExists
        = /** @type {MockedFunction<typeof mockThreadRepository.threadExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(false)));
		mockCommentRepository.commentExists
        = /** @type {MockedFunction<typeof mockCommentRepository.commentExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(true)));
		jest.spyOn(mockReplyRepository, 'addReply');

		const addReply = new AddReply(
			mockThreadRepository,
			mockCommentRepository,
			mockReplyRepository,
		);

		await expect(() => addReply.execute(userId, threadId, commentId, payload))
			.rejects.toThrowError('Failed to create a new reply. Thread not found');
		expect(mockThreadRepository.threadExists).toHaveBeenCalledWith(threadId);
		expect(mockReplyRepository.addReply).not.toHaveBeenCalled();
	});

	it('should throw an error when comment doesn\'t exist', async () => {
		const payload = {
			content: 'a comment',
		};
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const userId = 'user-123';
		const mockReplyRepository = new ReplyRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.threadExists
        = /** @type {MockedFunction<typeof mockThreadRepository.threadExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(true)));
		mockCommentRepository.commentExists
        = /** @type {MockedFunction<typeof mockCommentRepository.commentExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(false)));
		jest.spyOn(mockReplyRepository, 'addReply');

		const addReply = new AddReply(
			mockThreadRepository,
			mockCommentRepository,
			mockReplyRepository,
		);

		await expect(() => addReply.execute(userId, threadId, commentId, payload))
			.rejects.toThrowError('Failed to create a new reply. Comment not found');
		expect(mockCommentRepository.commentExists).toHaveBeenCalledWith(commentId);
		expect(mockReplyRepository.addReply).not.toHaveBeenCalled();
	});
});
