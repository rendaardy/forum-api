import {NotFoundError} from '#commons/exceptions/notfound-error.ts';
import {CreatedThread} from '#domains/threads/entities/created-thread.ts';
import {DetailedThread} from '#domains/threads/entities/detailed-thread.ts';
import {ThreadRepository} from '#domains/threads/thread-repository.ts';

import type {Pool} from 'pg';
import type {CreateThread} from '#domains/threads/entities/create-thread.ts';

type IdGeneratorFunction = () => string;

export class ThreadRepositoryPostgres extends ThreadRepository {
	#pool: Pool;
	#idGenerator: IdGeneratorFunction;

	constructor(pool: Pool, idGenerator: IdGeneratorFunction) {
		super();

		this.#pool = pool;
		this.#idGenerator = idGenerator;
	}

	async addThread(userId: string, createThread: CreateThread): Promise<CreatedThread> {
		const threadId = `thread-${this.#idGenerator()}`;
		const query = {
			text: `
                INSERT INTO
                    threads(id, title, body, user_id)
                VALUES
                    ($1, $2, $3, $4)
                RETURNING id, title, user_id AS owner
            `,
			values: [threadId, createThread.title, createThread.body, userId],
		};
		const result = await this.#pool.query(query);

		return new CreatedThread({...result.rows[0]});
	}

	async threadExists(threadId: string): Promise<boolean> {
		const result = await this.#pool.query({
			text: 'SELECT id FROM threads WHERE id = $1',
			values: [threadId],
		});

		if (result.rowCount <= 0) {
			return false;
		}

		return true;
	}

	async getDetailedThread(threadId: string): Promise<DetailedThread> {
		const query = {
			text: `
            SELECT
                threads.id,
                threads.title,
                threads.body,
                threads.date,
                users.username
            FROM
                threads
            LEFT JOIN users
                ON users.id = threads.user_id
            WHERE
                threads.id = $1
        `,
			values: [threadId],
		};
		const result = await this.#pool.query(query);

		if (result.rowCount <= 0) {
			throw new NotFoundError('Failed to retrieve a thread. Thread not found');
		}

		return new DetailedThread({...result.rows[0], comments: []});
	}
}
