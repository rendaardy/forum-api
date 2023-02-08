/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-unsafe-return */

/* c8 ignore start */

import {pool} from '#infrastructures/database/postgres/pool.ts';

export class ThreadsTableTestHelper {
	static async addThread({
		id = 'thread-abc123',
		title = 'a thread',
		body = 'thread body',
		date = new Date(),
		userId = 'user-abc123',
	}) {
		const query = {
			text: 'INSERT INTO threads(id, title, body, date, user_id) VALUES ($1, $2, $3, $4, $5)',
			values: [id, title, body, date, userId],
		};

		await pool.query(query);
	}

	static async addComment({
		id = 'comment-abc123',
		userId = 'user-abc123',
		replyTo = 'thread-abc123',
		date = new Date(),
		content = 'a comment',
	}) {
		const query = {
			text: 'INSERT INTO comments(id, user_id, reply_to, date, content) VALUES ($1, $2, $3, $4, $5)',
			values: [id, userId, replyTo, date, content],
		};

		await pool.query(query);
	}

	static async addReply({
		id = 'reply-abc234',
		userId = 'user-abc123',
		replyTo = 'comment-abc123',
		date = new Date(),
		content = 'a reply comment',
	}) {
		const query = {
			text: 'INSERT INTO replies(id, user_id, reply_to, date, content) VALUES ($1, $2, $3, $4, $5)',
			values: [id, userId, replyTo, date, content],
		};

		await pool.query(query);
	}

	static async findThreadById(id: string) {
		const query = {
			text: 'SELECT id, title, body, date, user_id FROM threads WHERE id = $1',
			values: [id],
		};
		const result = await pool.query(query);

		return result.rows;
	}

	static async findCommentById(id: string) {
		const query = {
			text: 'SELECT id, user_id, reply_to, date, content, is_deleted FROM comments WHERE id = $1',
			values: [id],
		};
		const result = await pool.query(query);

		return result.rows;
	}

	static async findReplyById(id: string) {
		const query = {
			text: 'SELECT id, user_id, reply_to, date, content, is_deleted FROM replies WHERE id = $1',
			values: [id],
		};
		const result = await pool.query(query);

		return result.rows;
	}

	static async removeCommentById(id: string) {
		await pool.query({
			text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
			values: [id],
		});
	}

	static async removeReplyById(id: string) {
		await pool.query({
			text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
			values: [id],
		});
	}

	static async hardRemoveComments() {
		await pool.query('DELETE FROM comments');
	}

	static async hardRemoveReplies() {
		await pool.query('DELETE FROM replies');
	}

	static async clearTable() {
		await pool.query('TRUNCATE TABLE replies CASCADE');
		await pool.query('TRUNCATE TABLE comments CASCADE');
		await pool.query('TRUNCATE TABLE threads CASCADE');
	}
}

/* c8 ignore stop */
