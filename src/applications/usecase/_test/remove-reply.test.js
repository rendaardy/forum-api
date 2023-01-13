import {describe, it, expect, jest} from '@jest/globals';

import {UserRepository} from '#domains/users/user-repository.js';
import {ThreadRepository} from '#domains/threads/thread-repository.js';
import {RemoveReply} from '../remove-reply.js';

/**
 * @template T
 * @typedef {import("@jest/globals").jest.MockedFunction<T>} MockedFunction
 */

describe('RemoveReply usecase', () => {
	it('should orchestrate the remove reply correctly', async () => {
		const username = 'dicoding';
		const userId = 'user-123';
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const replyId = 'comment-234';
		const mockUserRepository = new UserRepository();
		const mockThreadRepository = new ThreadRepository();

		mockUserRepository.getIdByUsername
		= /** @type {MockedFunction<typeof mockUserRepository.getIdByUsername>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve(userId)));
		mockThreadRepository.removeReply
		= /** @type {MockedFunction<typeof mockThreadRepository.removeReply>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve()));

		const removeReply = new RemoveReply(mockUserRepository, mockThreadRepository);

		await removeReply.execute(username, threadId, commentId, replyId);

		expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith(username);
		expect(mockThreadRepository.removeReply).toHaveBeenCalledWith(userId, threadId, commentId, replyId);
	});
});