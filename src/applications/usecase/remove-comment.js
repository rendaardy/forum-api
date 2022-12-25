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
   * @param {string} commentId
   * @returns {Promise<void>}
   */
	async execute(username, commentId) {
		const userId = await this.#userRepository.getIdByUsername(username);

		await this.#threadRepository.removeComment(userId, commentId);
	}
}
