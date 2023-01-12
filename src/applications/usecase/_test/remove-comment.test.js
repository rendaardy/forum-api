import {describe, it, expect, jest} from '@jest/globals';

import {UserRepository} from '#domains/users/user-repository.js';
import {ThreadRepository} from '#domains/threads/thread-repository.js';
import {RemoveComment} from '../remove-comment.js';

/**
 * @template T
 * @typedef {import("@jest/globals").jest.MockedFunction<T>} MockedFunction
 */

describe('RemoveComment usecase', () => {
	it('should orchestrate the remove comment usecase correctly', async () => {
		const username = 'dicoding';
		const userId = 'user-123';
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const mockUserRepository = new UserRepository();
		const mockThreadRepository = new ThreadRepository();

		mockUserRepository.getIdByUsername
      = /** @type {MockedFunction<typeof mockUserRepository.getIdByUsername>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(userId)));
		mockThreadRepository.removeComment
      = /** @type {MockedFunction<typeof mockThreadRepository.removeComment>} */(jest.fn()
				.mockImplementation(() => Promise.resolve()));

		const removeComment = new RemoveComment(mockUserRepository, mockThreadRepository);

		await removeComment.execute(username, threadId, commentId);

		expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith(username);
		expect(mockThreadRepository.removeComment).toHaveBeenCalledWith(userId, threadId, commentId);
	});
});
