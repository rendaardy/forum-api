import {NotFoundError} from '#commons/exceptions/notfound-error.js';
import {CreateReply} from '#domains/threads/entities/create-reply.js';

export class AddReply {
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
     * @param {import("#domains/threads/entities/create-reply.js").Payload} payload
     * @return {Promise<import("#domains/threads/entities/created-reply.js").CreatedReply>}
     */
	async execute(userId, threadId, commentId, payload) {
		const [threadExists, commentExists] = await Promise.all([
			this.#threadRepository.threadExists(threadId),
			this.#commentRepository.commentExists(commentId),
		]);

		if (!threadExists) {
			throw new NotFoundError('Failed to add new reply. Thread not found');
		}

		if (!commentExists) {
			throw new NotFoundError('Failed to add new reply. Comment not found');
		}

		const createReply = new CreateReply(payload);

		return this.#replyRepository.addReply(userId, commentId, createReply);
	}
}
