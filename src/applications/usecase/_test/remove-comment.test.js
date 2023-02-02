import {describe, it, expect, jest} from '@jest/globals';

import {CommentRepository} from '#domains/threads/comment-repository.js';
import {ThreadRepository} from '#domains/threads/thread-repository.js';
import {RemoveComment} from '../remove-comment.js';

/**
 * @template T
 * @typedef {import("@jest/globals").jest.MockedFunction<T>} MockedFunction
 */

describe('RemoveComment usecase', () => {
	it('should orchestrate the remove comment usecase correctly', async () => {
		const userId = 'user-123';
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.threadExists
        = /** @type {MockedFunction<typeof mockThreadRepository.threadExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(true)));
		mockCommentRepository.verifyCommentOwner
        = /** @type {MockedFunction<typeof mockCommentRepository.verifyCommentOwner>} */(jest.fn()
				.mockImplementation(() => Promise.resolve()));
		mockCommentRepository.removeComment
        = /** @type {MockedFunction<typeof mockCommentRepository.removeComment>} */(jest.fn()
				.mockImplementation(() => Promise.resolve()));

		const removeComment = new RemoveComment(mockThreadRepository, mockCommentRepository);

		await removeComment.execute(userId, threadId, commentId);

		expect(mockThreadRepository.threadExists).toHaveBeenCalledWith(threadId);
		expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(userId, commentId);
		expect(mockCommentRepository.removeComment).toHaveBeenCalledWith(commentId);
	});

	it('should throw an error when thread doesn\'t exist', async () => {
		const userId = 'user-123';
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.threadExists
        = /** @type {MockedFunction<typeof mockThreadRepository.threadExists>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(false)));
		jest.spyOn(mockCommentRepository, 'verifyCommentOwner');
		jest.spyOn(mockCommentRepository, 'removeComment');

		const removeComment = new RemoveComment(mockThreadRepository, mockCommentRepository);

		await expect(() => removeComment.execute(userId, threadId, commentId))
			.rejects.toThrowError('Failed to remove a comment. Thread not found');
		expect(mockCommentRepository.verifyCommentOwner).not.toHaveBeenCalled();
		expect(mockCommentRepository.removeComment).not.toHaveBeenCalled();
	});
});
