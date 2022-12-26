export class GetDetailedThread {
	#threadRepository;

	/**
   * @param {import("#domains/threads/thread-repository.js").ThreadRepository} threadRepository
   */
	constructor(threadRepository) {
		this.#threadRepository = threadRepository;
	}

	/**
   * @param {string} threadId
   * @returns {Promise<import("#domains/threads/entities/detailed-thread.js").DetailedThread>}
   */
	async execute(threadId) {
		const detailedThread = await this.#threadRepository.getDetailedThread(threadId);

		return detailedThread;
	}
}
