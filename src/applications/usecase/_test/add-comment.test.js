import {describe, it, expect, jest} from '@jest/globals';

import {UserRepository} from '#domains/users/user-repository.js';
import {ThreadRepository} from '#domains/threads/thread-repository.js';
import {CreateComment} from '#domains/threads/entities/create-comment.js';
import {CreatedComment} from '#domains/threads/entities/created-comment.js';
import {AddComment} from '../add-comment.js';

/**
 * @template T
 * @typedef {import("@jest/globals").jest.MockedFunction<T>} MockedFunction
 */

describe('AddComment usecase', () => {
	it('should orchestrate the add comment usecase correctly', async () => {
		const payload = {
			content: 'a comment',
		};
		const username = 'dicoding';
		const threadId = 'thread-123';
		const expectedUserId = 'user-123';
		const expectedCreatedComent = new CreatedComment({
			id: 'comment-123',
			content: 'a comment',
			owner: 'user-123',
		});
		const mockUserRepository = new UserRepository();
		const mockThreadRepository = new ThreadRepository();

		mockUserRepository.getIdByUsername
      = /** @type {MockedFunction<typeof mockUserRepository.getIdByUsername>} */(jest.fn()
				.mockImplementation(() => Promise.resolve('user-123')));
		mockThreadRepository.addComment
      = /** @type {MockedFunction<typeof mockThreadRepository.addComment>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(new CreatedComment({
					id: 'comment-123',
					content: 'a comment',
					owner: 'user-123',
				}))));

		const addComment = new AddComment(mockUserRepository, mockThreadRepository);

		const createdComment = await addComment.execute(username, threadId, payload);

		expect(createdComment).toStrictEqual(expectedCreatedComent);
		expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith(username);
		expect(mockThreadRepository.addComment).toHaveBeenCalledWith(expectedUserId, threadId, new CreateComment({
			content: payload.content,
		}));
	});
});
