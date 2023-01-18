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
import {CreateReply} from '#domains/threads/entities/create-reply.js';
import {CreatedReply} from '#domains/threads/entities/created-reply.js';
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
		it('should throw an error when userId isn\'t found', async () => {
			const createThread = new CreateThread({
				title: 'a thread',
				body: 'thread body',
			});
			const fakeIdGenerator = () => 'abc123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			await expect(threadRepository.addThread('user-abc', createThread))
				.rejects.toThrowError('User not found');
		});

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

	describe('addComment method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addThread({
				title: 'a thread',
				body: 'a thread body',
			});
		});

		it('should throw an error when userId isn\'t found', async () => {
			const createComment = new CreateComment({
				content: 'a comment',
			});
			const fakeIdGenerator = () => 'abc123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			await expect(threadRepository.addComment('user-abc', 'thread-abc123', createComment))
				.rejects.toThrowError('User not found');
		});

		it('should throw an error when threadId isn\'t found', async () => {
			const createComment = new CreateComment({
				content: 'a comment',
			});
			const fakeIdGenerator = () => 'abc123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			await expect(threadRepository.addComment('user-abc123', 'thread-abc', createComment))
				.rejects.toThrowError('Failed to create a new comment. Thread not found');
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

	describe('addReply method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addThread({
				id: 'thread-abc123',
				title: 'a thread',
				body: 'a thread body',
				userId: 'user-abc123',
			});
			await ThreadsTableTestHelper.addComment({
				id: 'comment-abc123',
				content: 'a comment',
				userId: 'user-abc234',
				replyTo: 'thread-abc123',
			});
		});

		it('should throw an error when userId isn\'t found', async () => {
			const createReply = new CreateReply({
				content: 'a reply comment',
			});
			const fakeIdGenerator = () => 'xyz123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			await expect(threadRepository.addReply('user-abc', 'thread-abc123', 'comment-abc123', createReply))
				.rejects.toThrowError('User not found');
		});

		it('should throw an error when threadId isn\'t found', async () => {
			const createReply = new CreateReply({
				content: 'a reply comment',
			});
			const fakeIdGenerator = () => 'xyz123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			await expect(threadRepository.addReply('user-abc123', 'thread-abc', 'comment-abc123', createReply))
				.rejects.toThrowError('Failed to create a new reply. Thread not found');
		});

		it('should throw an error when commentId isn\'t found', async () => {
			const createReply = new CreateReply({
				content: 'a reply comment',
			});
			const fakeIdGenerator = () => 'xyz123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			await expect(threadRepository.addReply('user-abc123', 'thread-abc123', 'comment-abc', createReply))
				.rejects.toThrowError('Failed to create a new reply. Comment not found');
		});

		it('should store reply to DB', async () => {
			const createReply = new CreateReply({
				content: 'a reply comment',
			});
			const fakeIdGenerator = () => 'xyz123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			await threadRepository.addReply('user-abc123', 'thread-abc123', 'comment-abc123', createReply);

			const replies = await ThreadsTableTestHelper.findReplyById('reply-xyz123');
			expect(replies).toHaveLength(1);
		});

		it('should return created reply', async () => {
			const createReply = new CreateReply({
				content: 'a reply comment',
			});
			const fakeIdGenerator = () => 'xyz123';
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

			const createdReply = await threadRepository.addReply('user-abc123', 'thread-abc123', 'comment-abc123', createReply);

			expect(createdReply).toStrictEqual(new CreatedReply({
				id: 'reply-xyz123',
				content: 'a reply comment',
				owner: 'user-abc123',
			}));
		});
	});

	describe('removeComment method', () => {
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

	describe('removeReply method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addThread({
				id: 'thread-abc123',
				title: 'a thread',
				body: 'thread body',
				userId: 'user-abc123',
			});
			await ThreadsTableTestHelper.addComment({
				id: 'comment-abc123',
				content: 'a comment',
				replyTo: 'thread-abc123',
				userId: 'user-abc234',
			});
			await ThreadsTableTestHelper.addReply({
				id: 'reply-xyz123',
				content: 'a reply comment',
				replyTo: 'comment-abc123',
				userId: 'user-abc345',
			});
		});

		it('should throw an error when thread isn\'t found', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await expect(() => threadRepository.removeReply('user-abc345', 'thread-abc', 'comment-abc123', 'reply-xyz123'))
				.rejects.toThrowError('Failed to remove a reply. Thread not found');
		});

		it('should throw an error when comment isn\'t found', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await expect(() => threadRepository.removeReply('user-abc345', 'thread-abc123', 'comment-abc', 'reply-xyz123'))
				.rejects.toThrowError('Failed to remove a reply. Comment not found');
		});

		it('should throw an error when reply isn\'t found', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await expect(() => threadRepository.removeReply('user-abc345', 'thread-abc123', 'comment-abc123', 'reply-xyz'))
				.rejects.toThrowError('Failed to remove a reply. Reply not found');
		});

		it('should throw an error when a user wants to remove whose reply isn\'t owned', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await expect(() => threadRepository.removeReply('user-abc', 'thread-abc123', 'comment-abc123', 'reply-xyz123'))
				.rejects.toThrowError('You\'re prohibited to get access of this resource');
		});

		it('should be doing soft-delete a reply from the database', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await threadRepository.removeReply('user-abc345', 'thread-abc123', 'comment-abc123', 'reply-xyz123');

			const replies = await ThreadsTableTestHelper.findReplyById('reply-xyz123');
			expect(replies[0].is_deleted).toBeTruthy();
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
			await ThreadsTableTestHelper.addComment({
				id: 'comment-abc123',
				userId: 'user-abc234',
				replyTo: 'thread-abc123',
                date: new Date(2022, 10, 10, 7, 0, 5),
				content: 'a comment',
			});
			await ThreadsTableTestHelper.addComment({
				id: 'comment-abc234',
				userId: 'user-abc345',
				replyTo: 'thread-abc123',
                date: new Date(2022, 10, 10, 9, 11, 15),
				content: 'a comment 2',
			});
			await ThreadsTableTestHelper.addReply({
				id: 'reply-xyz123',
				userId: 'user-abc123',
				replyTo: 'comment-abc123',
                date: new Date(2022, 10, 11, 14, 15, 16),
				content: 'a reply comment',
			});
			await ThreadsTableTestHelper.addReply({
				id: 'reply-xyz234',
				userId: 'user-abc234',
				replyTo: 'comment-abc123',
                date: new Date(2022, 10, 11, 15, 17, 20),
				content: 'a reply comment 2',
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
				comments: [
					{
						id: 'comment-abc123',
						username: 'alice',
                        date: new Date(2022, 10, 10, 7, 0, 5),
						content: 'a comment',
						replies: [
							{
								id: 'reply-xyz123',
								username: 'dicoding',
                                date: new Date(2022, 10, 11, 14, 15, 16),
								content: 'a reply comment',
							},
							{
                                id: 'reply-xyz234',
                                username: 'alice',
                                date: new Date(2022, 10, 11, 15, 17, 20),
                                content: 'a reply comment 2',
							},
						],
					},
					{
                        id: 'comment-abc234',
                        username: 'bob',
                        date: new Date(2022, 10, 10, 9, 11, 15),
                        content: 'a comment 2',
                        replies: [],
					},
				],
			}));
		});

		it('should return detailed thread with 1 comment and reply deleted', async () => {
			const threadRepository = new ThreadRepositoryPostgres(pool, () => '');

			await threadRepository.removeComment('user-abc345', 'thread-abc123', 'comment-abc234');
			await threadRepository.removeReply('user-abc234', 'thread-abc123', 'comment-abc123', 'reply-xyz234');
			const detailedThread = await threadRepository.getDetailedThread('thread-abc123');

			expect(detailedThread).toStrictEqual(new DetailedThread({
				id: 'thread-abc123',
				title: 'a thread',
				body: 'a thread body',
                date: new Date(2022, 10, 9, 14, 35, 10),
				username: 'dicoding',
				comments: [
					{
						id: 'comment-abc123',
						username: 'alice',
                        date: new Date(2022, 10, 10, 7, 0, 5),
						content: 'a comment',
						replies: [
							{
								id: 'reply-xyz123',
								username: 'dicoding',
                                date: new Date(2022, 10, 11, 14, 15, 16),
								content: 'a reply comment',
							},
							{
								id: 'reply-xyz234',
								username: 'alice',
                                date: new Date(2022, 10, 11, 15, 17, 20),
								content: '**balasan telah dihapus**',
							},
						],
					},
					{
						id: 'comment-abc234',
						username: 'bob',
                        date: new Date(2022, 10, 10, 9, 11, 15),
						content: '**komentar telah dihapus**',
						replies: [],
					},
				],
			}));
		});
	});
});
