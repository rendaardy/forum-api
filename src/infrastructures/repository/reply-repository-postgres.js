import {ReplyRepository} from '#domains/threads/reply-repository.js';
import {CreatedReply} from '#domains/threads/entities/created-reply.js';
import {DetailedReply} from '#domains/threads/entities/detailed-reply.js';
import {NotFoundError} from '#commons/exceptions/notfound-error.js';
import {AuthorizationError} from '#commons/exceptions/authorization-error.js';

/**
 * @typedef {() => string} IdGeneratorFunction
 */

/**
 * @implements ReplyRepository
 */
export class ReplyRepositoryPostgres extends ReplyRepository {
	#pool;
	#idGenerator;

	/**
     * @param {import("pg").Pool} pool
     * @param {IdGeneratorFunction} idGenerator
     */
	constructor(pool, idGenerator) {
		super();

		this.#pool = pool;
		this.#idGenerator = idGenerator;
	}

	/**
     * @param {string} userId
     * @param {string} commentId
     * @param {import("#domains/threads/entities/create-reply.js").CreateReply} createReply
     * @returns {Promise<import("#domains/threads/entities/created-reply.js").CreatedReply>}
     */
	async addReply(userId, commentId, createReply) {
		const replyId = `reply-${this.#idGenerator()}`;
		const query = {
			text: `
                INSERT INTO 
                    replies(id, user_id, reply_to, content) 
                VALUES 
                    ($1, $2, $3, $4)
                RETURNING id, content, user_id AS owner
            `,
			values: [replyId, userId, commentId, createReply.content],
		};
		const result = await this.#pool.query(query);

		return new CreatedReply({...result.rows[0]});
	}

	/**
     * @param {string} replyId
     * @returns {Promise<void>}
     */
	async removeReply(replyId) {
		const query = {
			text: 'UPDATE replies SET is_deleted = $1 WHERE id = $2',
			values: [true, replyId],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to remove a reply. Reply not found');
		}
	}

	/**
     * @param {string} userId
     * @param {string} replyId
     * @returns {Promise<void>}
     */
	async verifyReplyOwner(userId, replyId) {
		const query = {
			text: 'SELECT user_id FROM replies WHERE id = $1',
			values: [replyId],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new NotFoundError('Reply not found');
		}

		if (result.rows[0].user_id !== userId) {
			throw new AuthorizationError('You\'re prohibited to get access of this resource');
		}
	}

	/**
     * @param {string} replyId
     * @returns {Promise<boolean>}
     */
	async replyExists(replyId) {
		const result = await this.#pool.query({
			text: 'SELECT id FROM replies WHERE id = $1',
			values: [replyId],
		});

		if (result.rowCount <= 0) {
			return false;
		}

		return true;
	}

	/**
     * @param {string} commentId
     * @returns {Promise<[string, Array<import("#domains/threads/entities/detailed-reply.js").DetailedReply>]>}
     */
	async getAllDetailedRepliesFromComment(commentId) {
		const query = {
			text: `
                SELECT
                    replies.id,
                    users.username,
                    replies.date,
                    replies.content,
                    replies.date,
                    replies.is_deleted
                FROM replies
                INNER JOIN users ON users.id = replies.user_id
                WHERE replies.reply_to = $1
                ORDER BY replies.date ASC
            `,
			values: [commentId],
		};
		const result = await this.#pool.query(query);

		return [commentId, result.rows.map(it => new DetailedReply({
			id: it.id,
			username: it.username,
			content: it.content,
			date: it.date,
			isDeleted: it.is_deleted,
		}))];
	}
}
