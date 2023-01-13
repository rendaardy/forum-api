import 'core-js/actual/array/group-to-map.js';

import {AuthorizationError} from '#commons/exceptions/authorization-error.js';
import {NotFoundError} from '#commons/exceptions/notfound-error.js';
import {CreatedComment} from '#domains/threads/entities/created-comment.js';
import {CreatedThread} from '#domains/threads/entities/created-thread.js';
import {DetailedThread} from '#domains/threads/entities/detailed-thread.js';
import {ThreadRepository} from '#domains/threads/thread-repository.js';

/**
 * @typedef {() => string} IdGeneratorFunction
 */

/**
 * @implements ThreadRepository
 */
export class ThreadRepositoryPostgres extends ThreadRepository {
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
   * @param {import("#domains/threads/entities/create-thread.js").CreateThread} createThread
   * @returns {Promise<import("#domains/threads/entities/created-thread.js").CreatedThread>}
   */
	async addThread(userId, createThread) {
		const threadId = `thread-${this.#idGenerator()}`;
		const query = {
			text: 'INSERT INTO threads(id, title, body, user_id) VALUES ($1, $2, $3, $4) RETURNING id, title, user_id AS owner',
			values: [threadId, createThread.title, createThread.body, userId],
		};

		const result = await this.#pool.query(query);

		return new CreatedThread({...result.rows[0]});
	}

	/**
   * @param {string} userId
   * @param {string} threadId
   * @param {import("#domains/threads/entities/create-comment.js").CreateComment} createComment
   * @returns {Promise<import("#domains/threads/entities/created-comment.js").CreatedComment>}
   */
	async addComment(userId, threadId, createComment) {
		let result = await this.#pool.query({
			text: 'SELECT id FROM threads WHERE id = $1',
			values: [threadId],
		});

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to create a new comment. Thread not found');
		}

		const commentId = `comment-${this.#idGenerator()}`;
		const query = {
			text: 'INSERT INTO comments(id, user_id, reply_to, content) VALUES ($1, $2, $3, $4) RETURNING id, content, user_id AS owner',
			values: [commentId, userId, threadId, createComment.content],
		};
		result = await this.#pool.query(query);

		return new CreatedComment({...result.rows[0]});
	}

	/**
     * @param {string} userId
     * @param {string} threadId
     * @param {string} commentId
     * @param {import("#domains/threads/entities/create-comment.js").CreateComment} createComment
     * @return {Promise<import("#domains/threads/entities/created-comment.js").CreatedComment>}
     */
	async addReply(userId, threadId, commentId, createComment) {
		let result = await this.#pool.query({
			text: `
                SELECT 
                    comments.id AS comment_id
                FROM threads
                LEFT JOIN comments ON
                    threads.id = comments.reply_to
                WHERE
                    threads.id = $1
            `,
			values: [threadId],
		});

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to create a new reply. Thread not found');
		}

		if (result.rows[0].comment_id !== commentId) {
			throw new NotFoundError('Failed to create a new reply. Comment not found');
		}

		const replyId = `comment-${this.#idGenerator()}`;
		result = await this.#pool.query({
			text: `
                INSERT INTO 
                    comments(id, user_id, reply_to, content, comment_id) 
                VALUES 
                    ($1, $2, $3, $4, $5) 
                RETURNING id, content, user_id AS owner
            `,
			values: [replyId, userId, threadId, createComment.content, commentId],
		});

		return new CreatedComment({...result.rows[0]});
	}

	/**
   * @param {string} userId
   * @param {string} threadId
   * @param {string} commentId
   * @returns {Promise<void>}
   */
	async removeComment(userId, threadId, commentId) {
		let result = await this.#pool.query({
			text: `
                SELECT 
                    comments.id AS comment_id,
                    comments.user_id 
                FROM threads 
                LEFT JOIN comments ON threads.id = comments.reply_to 
                WHERE threads.id = $1
            `,
			values: [threadId],
		});

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to remove a comment. Thread not found');
		}

		if (result.rows[0].comment_id !== commentId) {
			throw new NotFoundError('Failed to remove a comment. Comment not found');
		}

		if (result.rows[0].user_id !== userId) {
			throw new AuthorizationError('You\'re prohibited to get access of this resource');
		}

		result = await this.#pool.query({
			text: 'UPDATE comments SET is_deleted = $1 WHERE id = $2',
			values: [true, commentId],
		});
	}

	/**
     * @param {string} userId
     * @param {string} threadId
     * @param {string} commentId
     * @param {string} replyId
     * @return {Promise<void>}
     */
	async removeReply(userId, threadId, commentId, replyId) {
		let result = await this.#pool.query({
			text: `
                SELECT
                    comments.id AS comment_id,
                    reply.id AS reply_id,
                    reply.user_id
                FROM threads
                LEFT JOIN comments ON
                    threads.id = comments.reply_to
                LEFT JOIN comments AS reply ON
                    comments.id = reply.comment_id
                WHERE threads.id = $1
            `,
			values: [threadId],
		});

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to remove a reply. Thread not found');
		}

		if (result.rows[0].comment_id !== commentId) {
			throw new NotFoundError('Failed to remove a reply. Comment not found');
		}

		if (result.rows[0].reply_id !== replyId) {
			throw new NotFoundError('Failed to remove a reply. Reply not found');
		}

		if (result.rows[0].user_id !== userId) {
			throw new AuthorizationError('You\'re prohibited to get access of this resource');
		}

		result = await this.#pool.query({
			text: 'UPDATE comments SET is_deleted = $1 WHERE id = $2',
			values: [true, replyId],
		});
	}

	/**
   * @param {string} threadId
   * @returns {Promise<import("#domains/threads/entities/detailed-thread.js").DetailedThread>}
   */
	async getDetailedThread(threadId) {
		const query = {
			text: `
        SELECT
          t.id AS thread_id,
          t.title AS thread_title,
          t.body AS thread_body,
          t.date AS thread_date,
          tu.username AS thread_username,
          c.id AS comment_id,
          cu.username AS comment_username,
          c.date AS comment_date,
          c.content AS comment_content,
          c.is_deleted AS comment_is_deleted
        FROM
          threads AS t
        LEFT JOIN comments AS c
          ON t.id = c.reply_to
        LEFT JOIN users AS tu
          ON t.user_id = tu.id
        LEFT JOIN users AS cu
          ON c.user_id = cu.id
        WHERE
          t.id = $1
        ORDER BY c.date ASC
      `,
			values: [threadId],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to retrieve a thread. Thread not found');
		}

		// @ts-ignore
		const threadsMap = result.rows.groupToMap(it => it.thread_id === threadId);
		/** @type {DetailedThread} */
		let detailedThread;

		for (const id of threadsMap.keys()) {
			const threadWithComments = threadsMap.get(id);
			// @ts-ignore
			const t = threadWithComments.find(it => it.thread_id === threadId);

			detailedThread = new DetailedThread({
				id: t.thread_id,
				title: t.thread_title,
				body: t.thread_body,
				username: t.thread_username,
				date: t.thread_date,
				// @ts-ignore
				comments: threadWithComments.map(it => ({
					id: it.comment_id,
					username: it.comment_username,
					date: it.comment_date,
					content: it.comment_is_deleted
						? '** This comment has been deleted **'
						: it.comment_content,
				})),
			});
		}

		// @ts-ignore
		return detailedThread;
	}
}
