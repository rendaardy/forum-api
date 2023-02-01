import {describe, it, expect, beforeAll, afterAll, beforeEach, afterEach} from '@jest/globals';

import {UsersTableTestHelper} from '#tests/users-table-test-helper.js';
import {ThreadsTableTestHelper} from '#tests/threads-table-test-helper.js';
import {pool} from '#infrastructures/database/postgres/pool.js';
import {CreateComment} from '#domains/threads/entities/create-comment.js';
import {CreatedComment} from '#domains/threads/entities/created-comment.js';
import {CommentRepositoryPostgres} from '../comment-repository-postgres.js';

describe('CommentRepositoryPostgres', () => {
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
		await ThreadsTableTestHelper.addThread({
			id: 'thread-abc123',
			title: 'a thread',
			body: 'a thread body',
			date: new Date(2022, 11, 9, 1, 45, 39),
			userId: 'user-abc123',
		});
		await ThreadsTableTestHelper.addThread({
			id: 'thread-abc234',
			title: 'a thread 2',
			body: 'a thread body 2',
			date: new Date(2022, 11, 12, 10, 30, 11),
			userId: 'user-abc234',
		});
	});

	afterAll(async () => {
		await ThreadsTableTestHelper.clearTable();
		await UsersTableTestHelper.clearTable();
		await pool.end();
	});

	describe('addComment method', () => {
		afterEach(async () => {
			await ThreadsTableTestHelper.hardRemoveComments();
		});

		it('should store comment to DB', async () => {
			const createComment = new CreateComment({
				content: 'a comment',
			});
			const fakeIdGenerator = () => 'abc123';
			const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

			await commentRepository.addComment('user-abc234', 'thread-abc123', createComment);

			const comments = await ThreadsTableTestHelper.findCommentById('comment-abc123');
			expect(comments).toHaveLength(1);
		});

		it('should return created comment', async () => {
			const createComment = new CreateComment({
				content: 'a comment',
			});
			const fakeIdGenerator = () => 'abc123';
			const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

			const createdComment = await commentRepository.addComment('user-abc234', 'thread-abc123', createComment);

			expect(createdComment).toStrictEqual(new CreatedComment({
				id: 'comment-abc123',
				content: 'a comment',
				owner: 'user-abc234',
			}));
		});
	});

	describe('removeComment method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addComment({
				id: 'comment-abc123',
				content: 'a comment',
				replyTo: 'thread-abc123',
				userId: 'user-abc234',
			});
		});

		afterEach(async () => {
			await ThreadsTableTestHelper.hardRemoveComments();
		});

		it('should throw an error when comment isn\'t found', async () => {
			const commentRepository = new CommentRepositoryPostgres(pool, () => '');

			await expect(() => commentRepository.removeComment('comment-abc'))
				.rejects.toThrowError('Failed to remove a comment. Comment not found');
		});

		it('should be doing soft-delete a comment from the database', async () => {
			const commentRepository = new CommentRepositoryPostgres(pool, () => '');

			await commentRepository.removeComment('comment-abc123');

			const comments = await ThreadsTableTestHelper.findCommentById('comment-abc123');
			expect(comments[0].is_deleted).toBeTruthy();
		});
	});

	describe('verifyCommentOwner method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addComment({
				id: 'comment-abc123',
				replyTo: 'thread-abc123',
				content: 'a comment',
				userId: 'user-abc234',
			});
		});

		afterEach(async () => {
			await ThreadsTableTestHelper.hardRemoveComments();
		});

		it('should throw an error when comment isn\'t found', async () => {
			const commentRepository = new CommentRepositoryPostgres(pool, () => '');

			await expect(() => commentRepository.verifyCommentOwner('user-abc234', 'comment-abc'))
				.rejects.toThrowError('Comment not found');
		});

		it('should throw an error when comment isn\'t owned by the user', async () => {
			const commentRepository = new CommentRepositoryPostgres(pool, () => '');

			await expect(() => commentRepository.verifyCommentOwner('user-abc123', 'comment-abc123'))
				.rejects.toThrowError('You\'re prohibited to get access of this resource');
		});

		it('should successfully verify the comment when it\'s owned by the user', async () => {
			const commentRepository = new CommentRepositoryPostgres(pool, () => '');

			expect(() => commentRepository.verifyCommentOwner('user-abc234', 'comment-abc123'))
				.not.toThrowError('Comment not found');
			expect(() => commentRepository.verifyCommentOwner('user-abc234', 'comment-abc123'))
				.not.toThrowError('You\'re prohibited to get access of this resource');
		});
	});

	describe('isCommentExists method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addComment({
				id: 'comment-abc123',
				content: 'a comment',
				replyTo: 'thread-abc123',
				userId: 'user-abc234',
			});
		});

		afterEach(async () => {
			await ThreadsTableTestHelper.hardRemoveComments();
		});

		it('should return false when comment doesn\'t exist', async () => {
			const commentRepository = new CommentRepositoryPostgres(pool, () => '');

			const exists = await commentRepository.commentExists('comment-abc');

			expect(exists).toBeFalsy();
		});

		it('should return true when comment exists', async () => {
			const commentRepository = new CommentRepositoryPostgres(pool, () => '');

			const exists = await commentRepository.commentExists('comment-abc123');

			expect(exists).toBeTruthy();
		});
	});

	describe('getAllDetailedCommentsFromThread method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addComment({
				id: 'comment-abc123',
				content: 'a comment',
				replyTo: 'thread-abc123',
				date: new Date(2022, 11, 12, 14, 21, 10),
				userId: 'user-abc234',
			});
			await ThreadsTableTestHelper.addComment({
				id: 'comment-abc234',
				content: 'a comment 2',
				replyTo: 'thread-abc123',
				date: new Date(2022, 11, 12, 16, 30, 5),
				userId: 'user-abc123',
			});
		});

		afterEach(async () => {
			await ThreadsTableTestHelper.hardRemoveComments();
		});

		it('should return a list of detailed comments from a thread', async () => {
			const commentRepository = new CommentRepositoryPostgres(pool, () => '');

			const detailedComments = await commentRepository.getAllDetailedCommentsFromThread('thread-abc123');

			expect(detailedComments).toHaveLength(2);
			expect(detailedComments[0].id).toEqual('comment-abc123');
			expect(detailedComments[0].content).toEqual('a comment');
			expect(detailedComments[0].username).toEqual('alice');
			expect(detailedComments[0].date).toEqual(new Date(2022, 11, 12, 14, 21, 10));
			expect(detailedComments[1].id).toEqual('comment-abc234');
			expect(detailedComments[1].content).toEqual('a comment 2');
			expect(detailedComments[1].username).toEqual('dicoding');
			expect(detailedComments[1].date).toEqual(new Date(2022, 11, 12, 16, 30, 5));
		});

		it('should return a list of detailed comments from a thread with 1 comment removed', async () => {
			const commentRepository = new CommentRepositoryPostgres(pool, () => '');

			await commentRepository.removeComment('comment-abc123');
			const detailedComments = await commentRepository.getAllDetailedCommentsFromThread('thread-abc123');

			expect(detailedComments).toHaveLength(2);
			expect(detailedComments[0].id).toEqual('comment-abc123');
			expect(detailedComments[0].content).toEqual('**komentar telah dihapus**');
			expect(detailedComments[0].username).toEqual('alice');
			expect(detailedComments[0].date).toEqual(new Date(2022, 11, 12, 14, 21, 10));
			expect(detailedComments[1].id).toEqual('comment-abc234');
			expect(detailedComments[1].content).toEqual('a comment 2');
			expect(detailedComments[1].username).toEqual('dicoding');
			expect(detailedComments[1].date).toEqual(new Date(2022, 11, 12, 16, 30, 5));
		});
	});
});
