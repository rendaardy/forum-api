import {NotFoundError} from '#commons/exceptions/notfound-error.ts';
import {CreateComment} from '#domains/threads/entities/create-comment.ts';

import type {ThreadRepository} from '#domains/threads/thread-repository.ts';
import type {CommentRepository} from '#domains/threads/comment-repository.ts';
import type {Payload} from '#domains/threads/entities/create-comment.ts';
import type {CreatedComment} from '#domains/threads/entities/created-comment.ts';

export class AddComment {
	#threadRepository: ThreadRepository;
	#commentRepository: CommentRepository;

	constructor(threadRepository: ThreadRepository, commentRepository: CommentRepository) {
		this.#threadRepository = threadRepository;
		this.#commentRepository = commentRepository;
	}

	async execute(userId: string, threadId: string, payload: Payload): Promise<CreatedComment> {
		const threadExists = await this.#threadRepository.threadExists(threadId);

		if (!threadExists) {
			throw new NotFoundError('Failed to create a new comment. Thread not found');
		}

		const createComment = new CreateComment(payload);

		return this.#commentRepository.addComment(userId, threadId, createComment);
	}
}
