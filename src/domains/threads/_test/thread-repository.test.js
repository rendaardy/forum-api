import {describe, it, expect} from '@jest/globals';

import {CreateThread} from '#domains/threads/entities/create-thread.js';
import {CreateComment} from '#domains/threads/entities/create-comment.js';
import {ThreadRepository} from '../thread-repository.js';

describe('ThreadRepository interface', () => {
	it('should throw an error when user try to invoke a method', async () => {
		const repository = new ThreadRepository();
		const createThread = new CreateThread({
			title: 'a thread',
			body: 'thread body',
		});
		const createComment = new CreateComment({
			content: 'a comment',
		});

		await expect(repository.addThread('user-123', createThread)).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.addComment('user-123', 'thread-123', createComment)).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.removeComment('user-123', 'thread-123', 'comment-123')).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.getDetailedThread('thread-123')).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});
