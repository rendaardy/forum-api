import {describe, it, expect, jest} from '@jest/globals';

import {ReplyRepository} from '#domains/threads/reply-repository.ts';
import {CommentRepository} from '#domains/threads/comment-repository.ts';
import {ThreadRepository} from '#domains/threads/thread-repository.ts';
import {CreateReply} from '#domains/threads/entities/create-reply.ts';
import {CreatedReply} from '#domains/threads/entities/created-reply.ts';
import {AddReply} from '../add-reply.ts';

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

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockCommentRepository.commentExists = jest.fn<typeof mockCommentRepository.commentExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockReplyRepository.addReply = jest.fn<typeof mockReplyRepository.addReply>()
			.mockImplementation(async () => Promise.resolve(new CreatedReply({
				id: 'reply-123',
				content: 'a reply comment',
				owner: 'user-123',
			})));

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

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(false));
		mockCommentRepository.commentExists = jest.fn<typeof mockCommentRepository.commentExists>()
			.mockImplementation(async () => Promise.resolve(true));
		jest.spyOn(mockReplyRepository, 'addReply');

		const addReply = new AddReply(
			mockThreadRepository,
			mockCommentRepository,
			mockReplyRepository,
		);

		await expect(async () => addReply.execute(userId, threadId, commentId, payload))
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

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockCommentRepository.commentExists = jest.fn<typeof mockCommentRepository.commentExists>()
			.mockImplementation(async () => Promise.resolve(false));
		jest.spyOn(mockReplyRepository, 'addReply');

		const addReply = new AddReply(
			mockThreadRepository,
			mockCommentRepository,
			mockReplyRepository,
		);

		await expect(async () => addReply.execute(userId, threadId, commentId, payload))
			.rejects.toThrowError('Failed to create a new reply. Comment not found');
		expect(mockCommentRepository.commentExists).toHaveBeenCalledWith(commentId);
		expect(mockReplyRepository.addReply).not.toHaveBeenCalled();
	});
});
