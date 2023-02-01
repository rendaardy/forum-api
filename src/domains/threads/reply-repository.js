/**
 * @interface
 */
export class ReplyRepository {
	/**
     * @param {string} _userId
     * @param {string} _commentId
     * @param {import("#domains/threads/entities/create-reply.js").CreateReply} _createReply
     * @returns {Promise<import("#domains/threads/entities/created-reply.js").CreatedReply>}
     */
	async addReply(_userId, _commentId, _createReply) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
     * @param {string} _replyId
     * @returns {Promise<void>}
     */
	async removeReply(_replyId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
     * @param {string} _userId
     * @param {string} _replyId
     * @returns {Promise<void>}
     */
	async verifyReplyOwner(_userId, _replyId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
     * @param {string} _replyId
     * @returns {Promise<boolean>}
     */
	async replyExists(_replyId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	/**
     * @param {string} _commentId
     * @returns {Promise<Array<import("#domains/threads/entities/detailed-reply.js").DetailedReply>>}
     */
	async getAllDetailedRepliesFromComment(_commentId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}
