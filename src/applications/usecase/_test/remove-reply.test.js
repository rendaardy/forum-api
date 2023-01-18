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
		const replyId = 'reply-234';
		const mockUserRepository = new UserRepository();
		const mockThreadRepository = new ThreadRepository();

		mockUserRepository.getIdByUsername
		= /** @type {MockedFunction<typeof mockUserRepository.getIdByUsername>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve('user-123')));
		mockThreadRepository.verifyReplyOwner
        = /** @type {MockedFunction<typeof mockThreadRepository.verifyReplyOwner>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve()));
		mockThreadRepository.removeReply
		= /** @type {MockedFunction<typeof mockThreadRepository.removeReply>} */ (jest.fn()
				.mockImplementation(() => Promise.resolve()));

		const removeReply = new RemoveReply(mockUserRepository, mockThreadRepository);

		await removeReply.execute(username, threadId, commentId, replyId);

		expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith(username);
		expect(mockThreadRepository.verifyReplyOwner).toHaveBeenCalledWith(userId, replyId);
		expect(mockThreadRepository.removeReply).toHaveBeenCalledWith(userId, threadId, commentId, replyId);
	});
});
