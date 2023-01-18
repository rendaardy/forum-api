export class RemoveComment {
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
   * @param {string} commentId
   * @returns {Promise<void>}
   */
	async execute(username, threadId, commentId) {
		const userId = await this.#userRepository.getIdByUsername(username);

		await this.#threadRepository.verifyCommentOwner(userId, commentId);
		await this.#threadRepository.removeComment(userId, threadId, commentId);
	}
}
