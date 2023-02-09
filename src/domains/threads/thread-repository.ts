import type {CreateThread} from './entities/create-thread.ts';
import type {CreatedThread} from './entities/created-thread.ts';
import type {DetailedThread} from './entities/detailed-thread.ts';

export class ThreadRepository {
	async addThread(_userId: string, _createThread: CreateThread): Promise<CreatedThread> {
		throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async threadExists(_threadId: string): Promise<boolean> {
		throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async getDetailedThread(_threadId: string): Promise<DetailedThread> {
		throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}
