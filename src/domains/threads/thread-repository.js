/**
 * @interface
 */
export class ThreadRepository {
	/**
   * @param {import("#domains/threads/entities/create-thread.js").CreateThread} _createThread
   * @returns {Promise<import("#domains/threads/entities/created-thread.js").CreatedThread>}
   */
	async addThread(_createThread) {
		throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
   * @param {string} _threadId
   * @param {import("#domains/threads/entities/create-comment.js").CreateComment} _createComment
   * @returns {Promise<import("#domains/threads/entities/created-comment.js").CreatedComment>}
   */
	async addComment(_threadId, _createComment) {
		throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
   * @param {string} _commentId
   * @returns {Promise<void>}
   */
	async removeComment(_commentId) {
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
