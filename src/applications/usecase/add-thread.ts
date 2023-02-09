import {CreateThread} from '#domains/threads/entities/create-thread.ts';

import type {ThreadRepository} from '#domains/threads/thread-repository.ts';
import type {Payload} from '#domains/threads/entities/create-thread.ts';
import type {CreatedThread} from '#domains/threads/entities/created-thread.ts';

export class AddThread {
	#threadRepository: ThreadRepository;

	constructor(threadRepository: ThreadRepository) {
		this.#threadRepository = threadRepository;
	}

	async execute(userId: string, payload: Payload): Promise<CreatedThread> {
		const createThread = new CreateThread(payload);

		return this.#threadRepository.addThread(userId, createThread);
	}
}
