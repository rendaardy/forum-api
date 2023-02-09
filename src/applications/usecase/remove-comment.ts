import {NotFoundError} from '#commons/exceptions/notfound-error.ts';

import type {ThreadRepository} from '#domains/threads/thread-repository.ts';
import type {CommentRepository} from '#domains/threads/comment-repository.ts';

export class RemoveComment {
	#threadRepository: ThreadRepository;
	#commentRepository: CommentRepository;

	constructor(threadRepository: ThreadRepository, commentRepository: CommentRepository) {
		this.#threadRepository = threadRepository;
		this.#commentRepository = commentRepository;
	}

	async execute(userId: string, threadId: string, commentId: string): Promise<void> {
		const threadExists = await this.#threadRepository.threadExists(threadId);

		if (!threadExists) {
			throw new NotFoundError('Failed to remove a comment. Thread not found');
		}

		await this.#commentRepository.verifyCommentOwner(userId, commentId);
		await this.#commentRepository.removeComment(commentId);
	}
}
