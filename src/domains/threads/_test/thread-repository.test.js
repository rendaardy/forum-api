import {describe, it, expect} from '@jest/globals';

import {ThreadRepository} from '../thread-repository.js';

describe('ThreadRepository interface', () => {
	it('should throw an error when user try to invoke a method', async () => {
		const repository = new ThreadRepository();
		const createThread = {
			title: 'a thread',
			body: 'thread body',
		};
		const createComment = {
			content: 'a comment',
		};
		const createReply = {
			content: 'a reply comment',
		};

		await expect(repository.addThread('user-123', /** @type {any} */(createThread))).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.addComment('user-123', 'thread-123', /** @type {any} */(createComment))).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.addReply('user-123', 'thread-123', 'comment-123', /** @type {any} */(createReply))).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.removeComment('thread-123', 'comment-123')).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.removeReply('thread-123', 'comment-123', 'reply-234')).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.verifyCommentOwner('user-123', 'comment-123')).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.verifyReplyOwner('user-123', 'reply-123')).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.getDetailedThread('thread-123')).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});
