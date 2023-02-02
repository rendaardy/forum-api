import {NotFoundError} from '#commons/exceptions/notfound-error.js';

export class RemoveReply {
	#threadRepository;
	#commentRepository;
	#replyRepository;

	/**
     * @param {import("#domains/threads/thread-repository.js").ThreadRepository} threadRepository
     * @param {import("#domains/threads/comment-repository.js").CommentRepository} commentRepository
     * @param {import("#domains/threads/reply-repository.js").ReplyRepository} replyRepository
     */
	constructor(threadRepository, commentRepository, replyRepository) {
		this.#threadRepository = threadRepository;
		this.#commentRepository = commentRepository;
		this.#replyRepository = replyRepository;
	}

	/**
     * @param {string} userId
     * @param {string} threadId
     * @param {string} commentId
     * @param {string} replyId
     * @return {Promise<void>}
     */
	async execute(userId, threadId, commentId, replyId) {
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
