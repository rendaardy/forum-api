export class RemoveReply {
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
     * @param {string} replyId
     * @return {Promise<void>}
     */
	async execute(username, threadId, commentId, replyId) {
		const userId = await this.#userRepository.getIdByUsername(username);

		await this.#threadRepository.verifyReplyOwner(userId, replyId);
		await this.#threadRepository.removeReply(userId, threadId, commentId, replyId);
	}
}
