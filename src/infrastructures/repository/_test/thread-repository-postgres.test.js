import {
	describe,
	it,
	expect,
	beforeEach,
	beforeAll,
	afterEach,
	afterAll,
} from '@jest/globals';

import {UsersTableTestHelper} from '#tests/users-table-test-helper.js';
import {ThreadsTableTestHelper} from '#tests/threads-table-test-helper.js';
import {CreateThread} from '#domains/threads/entities/create-thread.js';
import {CreatedThread} from '#domains/threads/entities/created-thread.js';
import {DetailedThread} from '#domains/threads/entities/detailed-thread.js';
import {pool} from '#infrastructures/database/postgres/pool.js';
import {ThreadRepositoryPostgres} from '../thread-repository-postgres.js';

describe('ThreadRepositoryPostgres', () => {
	afterEach(async () => {
		await ThreadsTableTestHelper.clearTable();
	});

	beforeAll(async () => {
		await UsersTableTestHelper.addUser({
			id: 'user-abc123',
			username: 'dicoding',
			password: 'secret_password',
			fullname: 'Dicoding Indonesia',
		});
		await UsersTableTestHelper.addUser({
			id: 'user-abc234',
			username: 'alice',
			password: 'secret_password',
			fullname: 'Alice',
		});
		await UsersTableTestHelper.addUser({
			id: 'user-abc345',
			username: 'bob',
			password: 'secret_password',
			fullname: 'Bob',
		});
	});

	afterAll(async () => {
		await UsersTableTestHelper.clearTable();
		await pool.end();
	});

	describe('addThread method', () => {
		it('should store thread to DB', async () => {
			const createThread = new CreateThread({
				title: 'a thread',
				body: 'thread body',
			});
			const fakeIdGenerator = () => 'abc123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			await threadRepository.addThread('user-abc123', createThread);

			const threads = await ThreadsTableTestHelper.findThreadById('thread-abc123');
			expect(threads).toHaveLength(1);
		});

		it('should return created thread', async () => {
			const createThread = new CreateThread({
				title: 'a thread',
				body: 'thread body',
			});
			const fakeIdGenerator = () => 'abc123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			const createdThread = await threadRepository.addThread('user-abc123', createThread);

			expect(createdThread).toStrictEqual(new CreatedThread({
				id: 'thread-abc123',
				title: 'a thread',
				owner: 'user-abc123',
			}));
		});
	});

	describe('threadExists method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addThread({
				id: 'thread-abc123',
				title: 'a thread',
				body: 'a thread body',
				userId: 'user-abc123',
			});
		});

		it('should return false when thread doesn\'t exist', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			const threadExists = await threadRepository.threadExists('thread-abc');

			expect(threadExists).toBeFalsy();
		});

		it('should return true when thread exists', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			const threadExists = await threadRepository.threadExists('thread-abc123');

			expect(threadExists).toBeTruthy();
		});
	});

	describe('getDetailedThread method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addThread({
				id: 'thread-abc123',
				title: 'a thread',
				body: 'a thread body',
				date: new Date(2022, 10, 9, 14, 35, 10),
				userId: 'user-abc123',
			});
		});

		it('should throw an error when thread isn\'t found', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await expect(() => threadRepository.getDetailedThread('thread-abc'))
				.rejects.toThrowError('Failed to retrieve a thread. Thread not found');
		});

		it('should return detailed thread successfully', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			const detailedThread = await threadRepository.getDetailedThread('thread-abc123');

			expect(detailedThread).toStrictEqual(new DetailedThread({
				id: 'thread-abc123',
				title: 'a thread',
				body: 'a thread body',
				date: new Date(2022, 10, 9, 14, 35, 10),
				username: 'dicoding',
				comments: [],
			}));
		});
	});
});
