import {NotFoundError} from '#commons/exceptions/notfound-error.ts';

import type {ThreadRepository} from '#domains/threads/thread-repository.ts';
import type {CommentRepository} from '#domains/threads/comment-repository.ts';

export class ToggleLikeComment {
	#threadRepository: ThreadRepository;
	#commentRepository: CommentRepository;

	constructor(
		threadRepository: ThreadRepository,
		commentRepository: CommentRepository,
	) {
		this.#threadRepository = threadRepository;
		this.#commentRepository = commentRepository;
	}

	async execute(userId: string, threadId: string, commentId: string): Promise<void> {
		const [threadExists, commentExists] = await Promise.all([
			this.#threadRepository.threadExists(threadId),
			this.#commentRepository.commentExists(commentId),
		]);

		if (!threadExists) {
			throw new NotFoundError('Thread not found');
		}

		if (!commentExists) {
			throw new NotFoundError('Comment not found');
		}

		const liked = await this.#commentRepository.hasBeenLiked(userId, commentId);

		if (liked) {
			await this.#commentRepository.unlikeComment(userId, commentId);
		} else {
			await this.#commentRepository.likeComment(userId, commentId);
		}
	}
}
