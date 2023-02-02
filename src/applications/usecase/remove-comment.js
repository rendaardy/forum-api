import {NotFoundError} from '#commons/exceptions/notfound-error.js';

export class RemoveComment {
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
     * @param {string} commentId
     * @returns {Promise<void>}
     */
	async execute(userId, threadId, commentId) {
		const threadExists = await this.#threadRepository.threadExists(threadId);

		if (!threadExists) {
			throw new NotFoundError('Failed to remove a comment. Thread not found');
		}

		await this.#commentRepository.verifyCommentOwner(userId, commentId);
		await this.#commentRepository.removeComment(commentId);
	}
}
