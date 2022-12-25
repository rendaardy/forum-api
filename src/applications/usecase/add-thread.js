import {CreateThread} from '#domains/threads/entities/create-thread.js';

export class AddThread {
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
   * @param {import("#domains/threads/entities/create-thread.js").Payload} payload
   * @returns {Promise<import("#domains/threads/entities/created-thread.js").CreatedThread>}
   */
	async execute(username, payload) {
		const userId = await this.#userRepository.getIdByUsername(username);
		const createThread = new CreateThread(payload);

		return this.#threadRepository.addThread(userId, createThread);
	}
}
