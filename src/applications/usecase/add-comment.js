import {NotFoundError} from '#commons/exceptions/notfound-error.js';
import {CreateComment} from '#domains/threads/entities/create-comment.js';

export class AddComment {
	#threadRepository;
	#commentRepository;

	/**
     * @param {import("#domains/threads/thread-repository.js").ThreadRepository} threadRepository
     * @param {import("#domains/threads/comment-repository.js").CommentRepository} commentRepository
     */
	constructor(threadRepository, commentRepository) {
		this.#threadRepository = threadRepository;
		this.#commentRepository = commentRepository;
	}

	/**
   * @param {string} userId
   * @param {string} threadId
   * @param {import("#domains/threads/entities/create-comment.js").Payload} payload
   * @returns {Promise<import("#domains/threads/entities/created-comment.js").CreatedComment>}
   */
	async execute(userId, threadId, payload) {
		const threadExists = await this.#threadRepository.threadExists(threadId);

		if (!threadExists) {
			throw new NotFoundError('Failed to add new comment. Thread not found');
		}

		const createComment = new CreateComment(payload);

		return this.#commentRepository.addComment(userId, threadId, createComment);
	}
}
