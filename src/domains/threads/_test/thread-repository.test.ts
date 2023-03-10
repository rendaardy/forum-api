import {describe, it, expect} from '@jest/globals';

import {CreateThread} from '#domains/threads/entities/create-thread.ts';
import {ThreadRepository} from '../thread-repository.ts';

describe('ThreadRepository interface', () => {
	it('should throw an error when user try to invoke a method', async () => {
		const repository = new ThreadRepository();
		const createThread = new CreateThread({
			title: 'a thread',
			body: 'thread body',
		});

		await expect(repository.addThread('user-123', createThread)).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.threadExists('thread-123')).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(repository.getDetailedThread('thread-123')).rejects
			.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});
