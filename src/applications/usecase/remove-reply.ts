import {NotFoundError} from '#commons/exceptions/notfound-error.ts';

import type {ThreadRepository} from '#domains/threads/thread-repository.ts';
import type {CommentRepository} from '#domains/threads/comment-repository.ts';
import type {ReplyRepository} from '#domains/threads/reply-repository.ts';

export class RemoveReply {
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

	async execute(userId: string, threadId: string, commentId: string, replyId: string): Promise<void> {
		const [threadExists, commentExists] = await Promise.all([
			this.#threadRepository.threadExists(threadId),
			this.#commentRepository.commentExists(commentId),
		]);

		if (!threadExists) {
			throw new NotFoundError('Failed to remove a reply. Thread not found');
		}

		if (!commentExists) {
			throw new NotFoundError('Failed to remove a reply. Comment not found');
		}

		await this.#replyRepository.verifyReplyOwner(userId, replyId);
		await this.#replyRepository.removeReply(replyId);
	}
}
