import {pool} from '#infrastructures/database/postgres/pool.js';

export class ThreadsTableTestHelper {
	static async addThread({
		id = 'thread-abc123',
		title = 'a thread',
		body = 'thread body',
		userId = 'user-abc123',
	}) {
		const query = {
			text: 'INSERT INTO threads(id, title, body, user_id) VALUES ($1, $2, $3, $4)',
			values: [id, title, body, userId],
		};

		await pool.query(query);
	}

	static async addComment({
		id = 'comment-abc123',
		userId = 'user-abc123',
		replyTo = 'thread-abc123',
		content = 'a comment',
	}) {
		const query = {
			text: 'INSERT INTO comments(id, user_id, reply_to, content) VALUES ($1, $2, $3, $4)',
			values: [id, userId, replyTo, content],
		};

		await pool.query(query);
	}

	/**
   * @param {string} id
   */
	static async findThreadById(id) {
		const query = {
			text: 'SELECT id, title, body, date, user_id FROM threads WHERE id = $1',
			values: [id],
		};
		const result = await pool.query(query);

		return result.rows;
	}

	/**
   * @param {string} id
   */
	static async findCommentById(id) {
		const query = {
			text: 'SELECT id, user_id, reply_to, date, content, is_deleted, comment_id FROM comments WHERE id = $1',
			values: [id],
		};
		const result = await pool.query(query);

		return result.rows;
	}

	static async clearTable() {
		await pool.query('TRUNCATE TABLE threads CASCADE');
		await pool.query('TRUNCATE TABLE comments CASCADE');
	}
}
