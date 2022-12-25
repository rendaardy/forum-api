import {CreateComment} from '#domains/threads/entities/create-comment.js';

export class AddComment {
	#userRepository;
	#threadRepository;

	/**
   * @param {import("#domains/users/user-repository.js").UserRepository} userRepository
   * @param {import("#domains/threads/thread-repository.js").ThreadRepository} threadRepository
   */
	constructor(userRepository, threadRepository) {
		this.#userRepository = userRepository;
		this.#threadRepository = threadRepository;
	}

	/**
   * @param {string} username
   * @param {string} threadId
   * @param {import("#domains/threads/entities/create-comment.js").Payload} payload
   * @returns {Promise<import("#domains/threads/entities/created-comment.js").CreatedComment>}
   */
	async execute(username, threadId, payload) {
		const userId = await this.#userRepository.getIdByUsername(username);
		const createComment = new CreateComment(payload);

		return this.#threadRepository.addComment(userId, threadId, createComment);
	}
}
