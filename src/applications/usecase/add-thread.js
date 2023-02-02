import {CreateThread} from '#domains/threads/entities/create-thread.js';

export class AddThread {
	#threadRepository;

	/**
   * @param {import("#domains/threads/thread-repository.js").ThreadRepository} threadRepository
   */
	constructor(threadRepository) {
		this.#threadRepository = threadRepository;
	}

	/**
     * @param {string} userId
   * @param {import("#domains/threads/entities/create-thread.js").Payload} payload
   * @returns {Promise<import("#domains/threads/entities/created-thread.js").CreatedThread>}
   */
	async execute(userId, payload) {
		const createThread = new CreateThread(payload);

		return this.#threadRepository.addThread(userId, createThread);
	}
}
