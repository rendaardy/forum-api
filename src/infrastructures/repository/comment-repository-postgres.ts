import {CommentRepository} from '#domains/threads/comment-repository.ts';
import {CreatedComment} from '#domains/threads/entities/created-comment.ts';
import {DetailedComment} from '#domains/threads/entities/detailed-comment.ts';
import {NotFoundError} from '#commons/exceptions/notfound-error.ts';
import {AuthorizationError} from '#commons/exceptions/authorization-error.ts';

import type {Pool} from 'pg';
import type {CreateComment} from '#domains/threads/entities/create-comment.ts';

type IdGeneratorFunction = () => string;

export class CommentRepositoryPostgres extends CommentRepository {
	#pool: Pool;
	#idGenerator: IdGeneratorFunction;

	constructor(pool: Pool, idGenerator: IdGeneratorFunction) {
		super();

		this.#pool = pool;
		this.#idGenerator = idGenerator;
	}

	async addComment(userId: string, threadId: string, createComment: CreateComment): Promise<CreatedComment> {
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

	async removeComment(commentId: string): Promise<void> {
		const query = {
			text: 'UPDATE comments SET is_deleted = $1 WHERE id = $2',
			values: [true, commentId],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to remove a comment. Comment not found');
		}
	}

	async verifyCommentOwner(userId: string, commentId: string): Promise<void> {
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

	async commentExists(commentId: string): Promise<boolean> {
		const query = {
			text: 'SELECT id FROM comments WHERE id = $1',
			values: [commentId],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			return false;
		}

		return true;
	}

	async getAllDetailedCommentsFromThread(threadId: string): Promise<DetailedComment[]> {
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
			isDeleted: it.is_deleted as boolean,
			replies: [],
		}));
	}
}
