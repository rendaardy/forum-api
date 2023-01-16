import {describe, it, expect, jest} from '@jest/globals';

import {UserRepository} from '#domains/users/user-repository.js';
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
		const username = 'dicoding';
		const threadId = 'thread-123';
		const commentId = 'comment-123';
		const expectedUserId = 'user-123';
		const expectedCreatedReply = new CreatedReply({
			id: 'reply-123',
			content: 'a reply comment',
			owner: 'user-123',
		});
		const mockUserRepository = new UserRepository();
		const mockThreadRepository = new ThreadRepository();

		mockUserRepository.getIdByUsername
      = /** @type {MockedFunction<typeof mockUserRepository.getIdByUsername>} */(jest.fn()
				.mockImplementation(() => Promise.resolve('user-123')));
		mockThreadRepository.addReply
      = /** @type {MockedFunction<typeof mockThreadRepository.addReply>} */(jest.fn()
				.mockImplementation(() => Promise.resolve(new CreatedReply({
					id: 'reply-123',
					content: 'a reply comment',
					owner: 'user-123',
				}))));

		const addReply = new AddReply(mockUserRepository, mockThreadRepository);

		const createdComment = await addReply.execute(username, threadId, commentId, payload);

		expect(createdComment).toStrictEqual(expectedCreatedReply);
		expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith(username);
		expect(mockThreadRepository.addReply)
			.toHaveBeenCalledWith(expectedUserId, threadId, commentId, new CreateReply({
				content: payload.content,
			}));
	});
});
