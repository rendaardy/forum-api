/**
 * @interface
 */
export class ThreadRepository {
	/**
     * @param {string} _userId
     * @param {import("#domains/threads/entities/create-thread.js").CreateThread} _createThread
     * @returns {Promise<import("#domains/threads/entities/created-thread.js").CreatedThread>}
     */
	async addThread(_userId, _createThread) {
		throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
     * @param {string} _threadId
     * @returns {Promise<boolean>}
     */
	async threadExists(_threadId) {
		throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
     * @param {string} _threadId
     * @returns {Promise<import("#domains/threads/entities/detailed-thread.js").DetailedThread>}
     */
	async getDetailedThread(_threadId) {
		throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}
