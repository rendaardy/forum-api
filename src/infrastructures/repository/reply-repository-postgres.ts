import {ReplyRepository} from '#domains/threads/reply-repository.ts';
import {CreatedReply} from '#domains/threads/entities/created-reply.ts';
import {DetailedReply} from '#domains/threads/entities/detailed-reply.ts';
import {NotFoundError} from '#commons/exceptions/notfound-error.ts';
import {AuthorizationError} from '#commons/exceptions/authorization-error.ts';

import type {Pool} from 'pg';
import type {CreateReply} from '#domains/threads/entities/create-reply.ts';

type IdGeneratorFunction = () => string;

export class ReplyRepositoryPostgres extends ReplyRepository {
	#pool: Pool;
	#idGenerator: IdGeneratorFunction;

	constructor(pool: Pool, idGenerator: IdGeneratorFunction) {
		super();

		this.#pool = pool;
		this.#idGenerator = idGenerator;
	}

	async addReply(userId: string, commentId: string, createReply: CreateReply): Promise<CreatedReply> {
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

	async removeReply(replyId: string): Promise<void> {
		const query = {
			text: 'UPDATE replies SET is_deleted = $1 WHERE id = $2',
			values: [true, replyId],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to remove a reply. Reply not found');
		}
	}

	async verifyReplyOwner(userId: string, replyId: string): Promise<void> {
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

	async replyExists(replyId: string): Promise<boolean> {
		const result = await this.#pool.query({
			text: 'SELECT id FROM replies WHERE id = $1',
			values: [replyId],
		});

		if (result.rowCount <= 0) {
			return false;
		}

		return true;
	}

	async getAllDetailedRepliesFromComment(commentId: string): Promise<[string, DetailedReply[]]> {
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
