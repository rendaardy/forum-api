import {NotFoundError} from '#commons/exceptions/notfound-error.js';
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

	/**
     * @param {string} threadId
     * @returns {Promise<boolean>}
     */
	async threadExists(threadId) {
		const result = await this.#pool.query({
			text: 'SELECT id FROM threads WHERE id = $1',
			values: [threadId],
		});

		if (result.rowCount <= 0) {
			return false;
		}

		return true;
	}

	/**
     * @param {string} threadId
     * @returns {Promise<import("#domains/threads/entities/detailed-thread.js").DetailedThread>}
     */
	async getDetailedThread(threadId) {
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
