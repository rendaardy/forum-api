import {NotFoundError} from '#commons/exceptions/notfound-error.ts';
import {CreateReply} from '#domains/threads/entities/create-reply.ts';

import type {ThreadRepository} from '#domains/threads/thread-repository.ts';
import type {CommentRepository} from '#domains/threads/comment-repository.ts';
import type {ReplyRepository} from '#domains/threads/reply-repository.ts';
import type {Payload} from '#domains/threads/entities/create-reply.ts';
import type {CreatedReply} from '#domains/threads/entities/created-reply.ts';

export class AddReply {
	#threadRepository: ThreadRepository;
	#commentRepository: CommentRepository;
	#replyRepository: ReplyRepository;

	constructor(
		threadRepository: ThreadRepository,
		commentRepository: CommentRepository,
		replyRepository: ReplyRepository,
	) {
		this.#threadRepository = threadRepository;
		this.#commentRepository = commentRepository;
		this.#replyRepository = replyRepository;
	}

	async execute(
		userId: string,
		threadId: string,
		commentId: string,
		payload: Payload,
	): Promise<CreatedReply> {
		const [threadExists, commentExists] = await Promise.all([
			this.#threadRepository.threadExists(threadId),
			this.#commentRepository.commentExists(commentId),
		]);

		if (!threadExists) {
			throw new NotFoundError('Failed to create a new reply. Thread not found');
		}

		if (!commentExists) {
			throw new NotFoundError('Failed to create a new reply. Comment not found');
		}

		const createReply = new CreateReply(payload);

		return this.#replyRepository.addReply(userId, commentId, createReply);
	}
}
