import {describe, it, expect, jest} from '@jest/globals';

import {ThreadRepository} from '#domains/threads/thread-repository.ts';
import {CommentRepository} from '#domains/threads/comment-repository.ts';
import {ToggleLikeComment} from '../toggle-like-comment.ts';

describe('ToggleLikeComment usecase', () => {
	it('should throw an error when thread doesn\'t exist', async () => {
		const threadId = 'thread-abc123';
		const mockThreadRepository = new ThreadRepository();
		const mockCommentRepository = new CommentRepository();

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(false));
		mockCommentRepository.commentExists = jest.fn<typeof mockCommentRepository.commentExists>()
			.mockImplementation(async () => Promise.resolve(true));
		jest.spyOn(mockCommentRepository, 'hasBeenLiked');
		jest.spyOn(mockCommentRepository, 'likeComment');
		jest.spyOn(mockCommentRepository, 'unlikeComment');

		const toggleLikeComment = new ToggleLikeComment(mockThreadRepository, mockCommentRepository);

		await expect(async () => toggleLikeComment.execute('user-abc123', 'thread-abc123', 'comment-abc123'))
			.rejects.toThrowError('Thread not found');
		expect(mockThreadRepository.threadExists).toHaveBeenCalledWith(threadId);
		expect(mockCommentRepository.hasBeenLiked).not.toHaveBeenCalled();
		expect(mockCommentRepository.likeComment).not.toHaveBeenCalled();
		expect(mockCommentRepository.unlikeComment).not.toHaveBeenCalled();
	});

	it('should throw an error when comment doesn\'t exist', async () => {
		const commentId = 'comment-abc123';
		const mockThreadRepository = new ThreadRepository();
		const mockCommentRepository = new CommentRepository();

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockCommentRepository.commentExists = jest.fn<typeof mockCommentRepository.commentExists>()
			.mockImplementation(async () => Promise.resolve(false));
		jest.spyOn(mockCommentRepository, 'hasBeenLiked');
		jest.spyOn(mockCommentRepository, 'likeComment');
		jest.spyOn(mockCommentRepository, 'unlikeComment');

		const toggleLikeComment = new ToggleLikeComment(mockThreadRepository, mockCommentRepository);

		await expect(async () => toggleLikeComment.execute('user-abc123', 'thread-abc123', 'comment-abc123'))
			.rejects.toThrowError('Comment not found');
		expect(mockCommentRepository.commentExists).toHaveBeenCalledWith(commentId);
		expect(mockCommentRepository.hasBeenLiked).not.toHaveBeenCalled();
		expect(mockCommentRepository.likeComment).not.toHaveBeenCalled();
		expect(mockCommentRepository.unlikeComment).not.toHaveBeenCalled();
	});

	it('should like the comment correctly', async () => {
		const userId = 'user-abc123';
		const threadId = 'thread-abc123';
		const commentId = 'comment-abc123';
		const mockThreadRepository = new ThreadRepository();
		const mockCommentRepository = new CommentRepository();

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockCommentRepository.commentExists = jest.fn<typeof mockCommentRepository.commentExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockCommentRepository.hasBeenLiked = jest.fn<typeof mockCommentRepository.hasBeenLiked>()
			.mockImplementation(async () => Promise.resolve(false));
		mockCommentRepository.likeComment = jest.fn<typeof mockCommentRepository.likeComment>()
			.mockImplementation(async () => Promise.resolve());
		mockCommentRepository.unlikeComment = jest.fn<typeof mockCommentRepository.unlikeComment>()
			.mockImplementation(async () => Promise.resolve());

		const toggleLikeComment = new ToggleLikeComment(mockThreadRepository, mockCommentRepository);

		await toggleLikeComment.execute('user-abc123', 'thread-abc123', 'comment-abc123');

		expect(mockThreadRepository.threadExists).toHaveBeenCalledWith(threadId);
		expect(mockCommentRepository.commentExists).toHaveBeenCalledWith(commentId);
		expect(mockCommentRepository.hasBeenLiked).toHaveBeenCalledWith(userId, commentId);
		expect(mockCommentRepository.likeComment).toHaveBeenCalledWith(userId, commentId);
		expect(mockCommentRepository.unlikeComment).not.toHaveBeenCalled();
	});

	it('should unlike the comment correctly', async () => {
		const userId = 'user-abc123';
		const threadId = 'thread-abc123';
		const commentId = 'comment-abc123';
		const mockThreadRepository = new ThreadRepository();
		const mockCommentRepository = new CommentRepository();

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockCommentRepository.commentExists = jest.fn<typeof mockCommentRepository.commentExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockCommentRepository.hasBeenLiked = jest.fn<typeof mockCommentRepository.hasBeenLiked>()
			.mockImplementation(async () => Promise.resolve(true));
		mockCommentRepository.likeComment = jest.fn<typeof mockCommentRepository.likeComment>()
			.mockImplementation(async () => Promise.resolve());
		mockCommentRepository.unlikeComment = jest.fn<typeof mockCommentRepository.unlikeComment>()
			.mockImplementation(async () => Promise.resolve());

		const toggleLikeComment = new ToggleLikeComment(mockThreadRepository, mockCommentRepository);

		await toggleLikeComment.execute('user-abc123', 'thread-abc123', 'comment-abc123');

		expect(mockThreadRepository.threadExists).toHaveBeenCalledWith(threadId);
		expect(mockCommentRepository.commentExists).toHaveBeenCalledWith(commentId);
		expect(mockCommentRepository.hasBeenLiked).toHaveBeenCalledWith(userId, commentId);
		expect(mockCommentRepository.likeComment).not.toHaveBeenCalled();
		expect(mockCommentRepository.unlikeComment).toHaveBeenCalledWith(userId, commentId);
	});
});
