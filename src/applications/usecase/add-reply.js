import {CreateReply} from '#domains/threads/entities/create-reply.js';

export class AddReply {
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
     * @param {import("#domains/threads/entities/create-reply.js").Payload} payload
     * @return {Promise<import("#domains/threads/entities/created-reply.js").CreatedReply>}
     */
	async execute(username, threadId, commentId, payload) {
		const userId = await this.#userRepository.getIdByUsername(username);
		const createReply = new CreateReply(payload);

		return this.#threadRepository.addReply(userId, threadId, commentId, createReply);
	}
}
