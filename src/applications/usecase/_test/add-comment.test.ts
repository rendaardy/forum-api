import {describe, it, expect, jest} from '@jest/globals';

import {CommentRepository} from '#domains/threads/comment-repository.ts';
import {ThreadRepository} from '#domains/threads/thread-repository.ts';
import {CreateComment} from '#domains/threads/entities/create-comment.ts';
import {CreatedComment} from '#domains/threads/entities/created-comment.ts';
import {AddComment} from '../add-comment.ts';

describe('AddComment usecase', () => {
	it('should orchestrate the add comment usecase correctly', async () => {
		const payload = {
			content: 'a comment',
		};
		const threadId = 'thread-123';
		const userId = 'user-123';
		const expectedCreatedComent = new CreatedComment({
			id: 'comment-123',
			content: 'a comment',
			owner: 'user-123',
		});
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(true));
		mockCommentRepository.addComment = jest.fn<typeof mockCommentRepository.addComment>()
			.mockImplementation(async () => Promise.resolve(new CreatedComment({
				id: 'comment-123',
				content: 'a comment',
				owner: 'user-123',
			})));

		const addComment = new AddComment(mockThreadRepository, mockCommentRepository);
		const createdComment = await addComment.execute(userId, threadId, payload);

		expect(createdComment).toStrictEqual(expectedCreatedComent);
		expect(mockThreadRepository.threadExists).toHaveBeenCalledWith(threadId);
		expect(mockCommentRepository.addComment).toHaveBeenCalledWith(userId, threadId, new CreateComment({
			content: payload.content,
		}));
	});

	it('should throw an error when thread doesn\'t exist', async () => {
		const payload = {
			content: 'a comment',
		};
		const threadId = 'thread-123';
		const userId = 'user-123';
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		mockThreadRepository.threadExists = jest.fn<typeof mockThreadRepository.threadExists>()
			.mockImplementation(async () => Promise.resolve(false));
		jest.spyOn(mockCommentRepository, 'addComment');

		const addComment = new AddComment(mockThreadRepository, mockCommentRepository);

		await expect(async () => addComment.execute(userId, threadId, payload))
			.rejects.toThrowError('Failed to create a new comment. Thread not found');
		expect(mockThreadRepository.threadExists).toHaveBeenCalledWith(threadId);
		expect(mockCommentRepository.addComment).not.toHaveBeenCalled();
	});
});
