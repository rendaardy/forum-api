import {CommentRepository} from '#domains/threads/comment-repository.js';
import {CreatedComment} from '#domains/threads/entities/created-comment.js';
import {DetailedComment} from '#domains/threads/entities/detailed-comment.js';
import {NotFoundError} from '#commons/exceptions/notfound-error.js';
import {AuthorizationError} from '#commons/exceptions/authorization-error.js';

/**
 * @typedef {() => string} IdGeneratorFunction
 */

/**
 * @implements CommentRepository
 */
export class CommentRepositoryPostgres extends CommentRepository {
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
     * @param {string} threadId
     * @param {import("#domains/threads/entities/create-comment.js").CreateComment} createComment
     * @returns {Promise<import("#domains/threads/entities/created-comment.js").CreatedComment>}
     */
	async addComment(userId, threadId, createComment) {
		const commentId = `comment-${this.#idGenerator()}`;
		const query = {
			text: `
                INSERT INTO 
                    comments(id, user_id, reply_to, content) 
                VALUES 
                    ($1, $2, $3, $4) 
                RETURNING id, user_id AS owner, content
            `,
			values: [commentId, userId, threadId, createComment.content],
		};
		const result = await this.#pool.query(query);

		return new CreatedComment({...result.rows[0]});
	}

	/**
     * @param {string} commentId
     * @returns {Promise<void>}
     */
	async removeComment(commentId) {
		const query = {
			text: 'UPDATE comments SET is_deleted = $1 WHERE id = $2',
			values: [true, commentId],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to remove a comment. Comment not found');
		}
	}

	/**
     * @param {string} userId
     * @param {string} commentId
     * @returns {Promise<void>}
     */
	async verifyCommentOwner(userId, commentId) {
		const query = {
			text: 'SELECT user_id FROM comments WHERE id = $1',
			values: [commentId],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new NotFoundError('Comment not found');
		}

		if (result.rows[0].user_id !== userId) {
			throw new AuthorizationError('You\'re prohibited to get access of this resource');
		}
	}

	/**
     * @param {string} commentId
     * @returns {Promise<boolean>}
     */
	async commentExists(commentId) {
		const result = await this.#pool.query({
			text: 'SELECT id FROM comments WHERE id = $1',
			values: [commentId],
		});

		if (result.rowCount <= 0) {
			return false;
		}

		return true;
	}

	/**
     * @param {string} threadId
     * @returns {Promise<Array<import("#domains/threads/entities/detailed-comment.js").DetailedComment>>}
     */
	async getAllDetailedCommentsFromThread(threadId) {
		const query = {
			text: `
                SELECT
                    comments.id,
                    users.username,
                    comments.date,
                    comments.content,
                    comments.is_deleted
                FROM comments
                INNER JOIN users ON users.id = comments.user_id
                WHERE comments.reply_to = $1
                ORDER BY comments.date ASC
            `,
			values: [threadId],
		};
		const result = await this.#pool.query(query);

		return result.rows.map(it => new DetailedComment({
			id: it.id,
			username: it.username,
			date: it.date,
			content: it.content,
			isDeleted: it.is_deleted,
			replies: [],
		}));
	}
}
