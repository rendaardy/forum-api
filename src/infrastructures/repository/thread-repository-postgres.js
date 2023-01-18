import 'core-js/actual/array/group-to-map.js';

import pg from 'pg';
import * as pgError from '@renda_ardy/pg-error-constants';

import {AuthorizationError} from '#commons/exceptions/authorization-error.js';
import {NotFoundError} from '#commons/exceptions/notfound-error.js';
import {CreatedComment} from '#domains/threads/entities/created-comment.js';
import {CreatedThread} from '#domains/threads/entities/created-thread.js';
import {CreatedReply} from '#domains/threads/entities/created-reply.js';
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

		try {
			const result = await this.#pool.query(query);

			return new CreatedThread({...result.rows[0]});
		} catch (error) {
			if (error instanceof pg.DatabaseError) {
				if (error.code === pgError.FOREIGN_KEY_VIOLATION && error.constraint === 'threads.user_id.fkey') {
					throw new NotFoundError('User not found');
				}
			}

			throw error;
		}
	}

	/**
   * @param {string} userId
   * @param {string} threadId
   * @param {import("#domains/threads/entities/create-comment.js").CreateComment} createComment
   * @returns {Promise<import("#domains/threads/entities/created-comment.js").CreatedComment>}
   */
	async addComment(userId, threadId, createComment) {
		try {
			const commentId = `comment-${this.#idGenerator()}`;
			const query = {
				text: `
                    INSERT INTO 
                        comments(id, user_id, reply_to, content) 
                    VALUES 
                        ($1, $2, $3, $4) 
                    RETURNING id, content, user_id AS owner`,
				values: [commentId, userId, threadId, createComment.content],
			};
			const result = await this.#pool.query(query);

			return new CreatedComment({...result.rows[0]});
		} catch (error) {
			if (error instanceof pg.DatabaseError) {
				if (error.code === pgError.FOREIGN_KEY_VIOLATION && error.constraint === 'comments.reply_to.fkey') {
					throw new NotFoundError('Failed to create a new comment. Thread not found');
				}

				if (error.code === pgError.FOREIGN_KEY_VIOLATION && error.constraint === 'comments.user_id.fkey') {
					throw new NotFoundError('User not found');
				}
			}

			throw error;
		}
	}

	/**
     * @param {string} userId
     * @param {string} threadId
     * @param {string} commentId
     * @param {import("#domains/threads/entities/create-reply.js").CreateReply} createReply
     * @return {Promise<import("#domains/threads/entities/created-reply.js").CreatedReply>}
     */
	async addReply(userId, threadId, commentId, createReply) {
		let result = await this.#pool.query({
			text: 'SELECT id FROM threads WHERE id = $1',
			values: [threadId],
		});

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to create a new reply. Thread not found');
		}

		try {
			const replyId = `reply-${this.#idGenerator()}`;
			result = await this.#pool.query({
				text: `
                    INSERT INTO 
                        replies(id, user_id, reply_to, content) 
                    VALUES 
                        ($1, $2, $3, $4) 
                    RETURNING id, content, user_id AS owner
                `,
				values: [replyId, userId, commentId, createReply.content],
			});

			return new CreatedReply({...result.rows[0]});
		} catch (error) {
			if (error instanceof pg.DatabaseError) {
				if (error.code === pgError.FOREIGN_KEY_VIOLATION && error.constraint === 'replies.reply_to.fkey') {
					throw new NotFoundError('Failed to create a new reply. Comment not found');
				}

				if (error.code === pgError.FOREIGN_KEY_VIOLATION && error.constraint === 'replies.user_id.fkey') {
					throw new NotFoundError('User not found');
				}
			}

			throw error;
		}
	}

	/**
   * @param {string} threadId
   * @param {string} commentId
   * @returns {Promise<void>}
   */
	async removeComment(threadId, commentId) {
		let result = await this.#pool.query({
			text: `
                SELECT 
                    comments.id AS comment_id
                FROM threads 
                LEFT JOIN comments ON threads.id = comments.reply_to 
                WHERE threads.id = $1
            `,
			values: [threadId],
		});

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to remove a comment. Thread not found');
		}

		const row = result.rows.find(it => it.comment_id === commentId);

		if (!row) {
			throw new NotFoundError('Failed to remove a comment. Comment not found');
		}

		result = await this.#pool.query({
			text: 'UPDATE comments SET is_deleted = $1 WHERE id = $2',
			values: [true, commentId],
		});
	}

	/**
     * @param {string} threadId
     * @param {string} commentId
     * @param {string} replyId
     * @return {Promise<void>}
     */
	async removeReply(threadId, commentId, replyId) {
		let result = await this.#pool.query({
			text: `
                SELECT
                    comments.id AS comment_id,
                    replies.id AS reply_id
                FROM threads
                LEFT JOIN comments ON
                    threads.id = comments.reply_to
                LEFT JOIN replies ON
                    comments.id = replies.reply_to
                WHERE threads.id = $1
            `,
			values: [threadId],
		});

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to remove a reply. Thread not found');
		}

		const comment = result.rows.find(it => it.comment_id === commentId);

		if (!comment) {
			throw new NotFoundError('Failed to remove a reply. Comment not found');
		}

		const reply = result.rows.find(it => it.reply_id === replyId);

		if (!reply) {
			throw new NotFoundError('Failed to remove a reply. Reply not found');
		}

		result = await this.#pool.query({
			text: 'UPDATE replies SET is_deleted = $1 WHERE id = $2',
			values: [true, replyId],
		});
	}

	/**
     * @param {string} userId
     * @param {string} commentId
     * @return {Promise<void>}
     */
	async verifyCommentOwner(userId, commentId) {
		const result = await this.#pool.query({
			text: 'SELECT user_id FROM comments WHERE id = $1',
			values: [commentId],
		});

		if (result.rowCount <= 0) {
			throw new NotFoundError('Comment not found');
		}

		if (result.rows[0].user_id !== userId) {
			throw new AuthorizationError('You\'re prohibited to get access of this resource');
		}
	}

	/**
     * @param {string} userId
     * @param {string} replyId
     * @return {Promise<void>}
     */
	async verifyReplyOwner(userId, replyId) {
		const result = await this.#pool.query({
			text: 'SELECT user_id FROM replies WHERE id = $1',
			values: [replyId],
		});

		if (result.rowCount <= 0) {
			throw new NotFoundError('Reply not found');
		}

		if (result.rows[0].user_id !== userId) {
			throw new AuthorizationError('You\'re prohibited to get access of this resource');
		}
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
                c.is_deleted AS comment_is_deleted,
                r.id AS reply_id,
                ru.username AS reply_username,
                r.date AS reply_date,
                r.content AS reply_content,
                r.is_deleted AS reply_is_deleted
            FROM
                threads AS t
            LEFT JOIN comments AS c
                ON t.id = c.reply_to
            LEFT JOIN replies AS r
                ON c.id = r.reply_to
            LEFT JOIN users AS tu
                ON t.user_id = tu.id
            LEFT JOIN users AS cu
                ON c.user_id = cu.id
            LEFT JOIN users AS ru
                ON r.user_id = ru.id
            WHERE
                t.id = $1
            ORDER BY c.date, r.date ASC
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
			const t = threadWithComments.find(it => it.thread_id === threadId);

			const commentsMap = threadWithComments.groupToMap(it => it.comment_id);
			const comments = [];

			for (const commentId of commentsMap.keys()) {
				const commentWithReplies = commentsMap.get(commentId);
				const c = commentWithReplies.find(it => it.comment_id === commentId);

				comments.push({
					id: c.comment_id,
					username: c.comment_username,
					date: c.comment_date,
					content: c.comment_is_deleted
						? '**komentar telah dihapus**'
						: c.comment_content,
					replies: commentWithReplies
						.map(it => ({
							id: it.reply_id,
							username: it.reply_username,
							date: it.reply_date,
							content: it.reply_is_deleted
								? '**balasan telah dihapus**'
								: it.reply_content,
						}))
						.filter(it => it.id !== null),
				});
			}

			detailedThread = new DetailedThread({
				id: t.thread_id,
				title: t.thread_title,
				body: t.thread_body,
				username: t.thread_username,
				date: t.thread_date,
				comments,
			});
		}

		// @ts-ignore
		return detailedThread;
	}
}
