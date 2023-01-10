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
import {CreateComment} from '#domains/threads/entities/create-comment.js';
import {CreatedComment} from '#domains/threads/entities/created-comment.js';
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

	describe('addComment', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addThread({
				title: 'a thread',
				body: 'a thread body',
			});
		});

		it('should store comment to DB', async () => {
			const createComment = new CreateComment({
				content: 'a comment',
			});
			const fakeIdGenerator = () => 'abc123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			await threadRepository.addComment('user-abc123', 'thread-abc123', createComment);

			const comments = await ThreadsTableTestHelper.findCommentById('comment-abc123');
			expect(comments).toHaveLength(1);
		});

		it('should return created comment', async () => {
			const createComment = new CreateComment({
				content: 'a comment',
			});
			const fakeIdGenerator = () => 'abc123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			const createdComment = await threadRepository.addComment('user-abc123', 'thread-abc123', createComment);

			expect(createdComment).toStrictEqual(new CreatedComment({
				id: 'comment-abc123',
				content: 'a comment',
				owner: 'user-abc123',
			}));
		});
	});

	describe('removeComment', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addThread({
				title: 'a thread',
				body: 'thread body',
				userId: 'user-abc123',
			});
			await ThreadsTableTestHelper.addComment({
				content: 'a comment',
				replyTo: 'thread-abc123',
				userId: 'user-abc123',
			});
		});

		it('should throw an error when thread isn\'t found', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await expect(() => threadRepository.removeComment('user-abc123', 'thread-abc', 'comment-abc123'))
				.rejects.toThrowError('Failed to remove a comment. Thread not found');
		});

		it('should throw an error when comment isn\'t found', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await expect(() => threadRepository.removeComment('user-abc123', 'thread-abc123', 'comment-abc'))
				.rejects.toThrowError('Failed to remove a comment. Comment not found');
		});

		it('should throw an error when a user wants to remove whose comment isn\'t owned', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await expect(() => threadRepository.removeComment('user-abc', 'thread-abc123', 'comment-abc123'))
				.rejects.toThrowError('You\'re prohibited to get access of this resource');
		});

		it('should be doing soft-delete a comment from the database', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await threadRepository.removeComment('user-abc123', 'thread-abc123', 'comment-abc123');

			const comments = await ThreadsTableTestHelper.findCommentById('comment-abc123');
			expect(comments[0].is_deleted).toBeTruthy();
		});
	});

	describe('getDetailedThread', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addThread({
				id: 'thread-abc123',
				title: 'a thread',
				body: 'a thread body',
				userId: 'user-abc123',
			});
			await ThreadsTableTestHelper.addComment({
				id: 'comment-abc123',
				userId: 'user-abc234',
				replyTo: 'thread-abc123',
				content: 'a comment',
			});
			await ThreadsTableTestHelper.addComment({
				id: 'comment-abc234',
				userId: 'user-abc345',
				replyTo: 'thread-abc123',
				content: 'a comment 2',
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
				date: detailedThread.date,
				username: 'dicoding',
				comments: [
					{
						id: 'comment-abc123',
						username: 'alice',
						date: detailedThread.comments[0].date,
						content: 'a comment',
					},
					{
						id: 'comment-abc234',
						username: 'bob',
						date: detailedThread.comments[1].date,
						content: 'a comment 2',
					},
				],
			}));
		});

		it('should return detailed thread with 1 comment deleted', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await threadRepository.removeComment('user-abc234', 'thread-abc123', 'comment-abc123');
			const detailedThread = await threadRepository.getDetailedThread('thread-abc123');

			expect(detailedThread).toStrictEqual(new DetailedThread({
				id: 'thread-abc123',
				title: 'a thread',
				body: 'a thread body',
				date: detailedThread.date,
				username: 'dicoding',
				comments: [
					{
						id: 'comment-abc123',
						username: 'alice',
						date: detailedThread.comments[0].date,
						content: '** This comment has been deleted **',
					},
					{
						id: 'comment-abc234',
						username: 'bob',
						date: detailedThread.comments[1].date,
						content: 'a comment 2',
					},
				],
			}));
		});
	});
});
