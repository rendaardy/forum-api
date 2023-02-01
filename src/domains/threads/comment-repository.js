/**
 * @interface
 */
export class CommentRepository {
	/**
     * @param {string} _userId
     * @param {string} _threadId
     * @param {import("#domains/threads/entities/create-comment.js").CreateComment} _createComment
     * @returns {Promise<import("#domains/threads/entities/created-comment.js").CreatedComment>}
     */
	async addComment(_userId, _threadId, _createComment) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
     * @param {string} _commentId
     * @returns {Promise<void>}
     */
	async removeComment(_commentId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
     * @param {string} _userId
     * @param {string} _commentId
     * @returns {Promise<void>}
     */
	async verifyCommentOwner(_userId, _commentId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
     * @param {string} _commentId
     * @returns {Promise<boolean>}
     */
	async commentExists(_commentId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
     * @param {string} _threadId
     * @returns {Promise<Array<import("#domains/threads/entities/detailed-comment.js").DetailedComment>>}
     */
	async getAllDetailedCommentsFromThread(_threadId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}
