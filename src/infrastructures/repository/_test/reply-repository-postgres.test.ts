import {describe, it, expect, beforeAll, afterAll, beforeEach, afterEach} from '@jest/globals';

import {UsersTableTestHelper} from '#tests/users-table-test-helper.ts';
import {ThreadsTableTestHelper} from '#tests/threads-table-test-helper.ts';
import {pool} from '#infrastructures/database/postgres/pool.ts';
import {ReplyRepositoryPostgres} from '../reply-repository-postgres.ts';
import {CreateReply} from '#domains/threads/entities/create-reply.ts';
import {CreatedReply} from '#domains/threads/entities/created-reply.ts';

describe('ReplyRepositoryPostgres', () => {
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
		await ThreadsTableTestHelper.addComment({
			id: 'comment-abc123',
			content: 'a comment',
			replyTo: 'thread-abc123',
			userId: 'user-abc234',
			date: new Date(2022, 11, 10, 8, 15, 0),
		});
		await ThreadsTableTestHelper.addComment({
			id: 'comment-abc234',
			content: 'a comment 2',
			replyTo: 'thread-abc123',
			userId: 'user-abc123',
			date: new Date(2022, 11, 11, 9, 30, 15),
		});
	});

	afterAll(async () => {
		await ThreadsTableTestHelper.clearTable();
		await UsersTableTestHelper.clearTable();
		await pool.end();
	});

	describe('addReply method', () => {
		afterEach(async () => {
			await ThreadsTableTestHelper.hardRemoveReplies();
		});

		it('should store reply to DB', async () => {
			const createReply = new CreateReply({
				content: 'a reply comment',
			});
			const fakeIdGenerator = () => 'abc123';
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

			await replyRepository.addReply('user-abc123', 'comment-abc123', createReply);

			const replies = await ThreadsTableTestHelper.findReplyById('reply-abc123');
			expect(replies).toHaveLength(1);
		});

		it('should return created reply', async () => {
			const createReply = new CreateReply({
				content: 'a reply comment',
			});
			const fakeIdGenerator = () => 'abc123';
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

			const createdReply = await replyRepository.addReply('user-abc123', 'comment-abc123', createReply);

			expect(createdReply).toStrictEqual(new CreatedReply({
				id: 'reply-abc123',
				content: 'a reply comment',
				owner: 'user-abc123',
			}));
		});
	});

	describe('removeReply method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addReply({
				id: 'reply-abc123',
				content: 'a reply comment',
				replyTo: 'comment-abc123',
				userId: 'user-abc234',
			});
		});

		afterEach(async () => {
			await ThreadsTableTestHelper.hardRemoveReplies();
		});

		it('should throw an error when reply isn\'t found', async () => {
			const replyRepository = new ReplyRepositoryPostgres(pool, () => '');

			await expect(async () => replyRepository.removeReply('reply-xyz'))
				.rejects.toThrowError('Failed to remove a reply. Reply not found');
		});

		it('should be doing soft-delete a reply from the database', async () => {
			const replyRepository = new ReplyRepositoryPostgres(pool, () => '');

			await replyRepository.removeReply('reply-abc123');

			const replies = await ThreadsTableTestHelper.findReplyById('reply-abc123');
			expect(replies[0].is_deleted).toBeTruthy();
		});
	});

	describe('verifyReplyOwner method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addReply({
				id: 'reply-abc123',
				replyTo: 'comment-abc123',
				content: 'a reply comment',
				userId: 'user-abc234',
			});
		});

		afterEach(async () => {
			await ThreadsTableTestHelper.hardRemoveReplies();
		});

		it('should throw an error when reply isn\'t found', async () => {
			const replyRepository = new ReplyRepositoryPostgres(pool, () => '');

			await expect(async () => replyRepository.verifyReplyOwner('user-abc234', 'reply-abc'))
				.rejects.toThrowError('Reply not found');
		});

		it('should throw an error when reply isn\'t owned by the user', async () => {
			const replyRepository = new ReplyRepositoryPostgres(pool, () => '');

			await expect(async () => replyRepository.verifyReplyOwner('user-abc', 'reply-abc123'))
				.rejects.toThrowError('You\'re prohibited to get access of this resource');
		});

		it('should successfully verify when reply is owned by the user', async () => {
			const replyRepository = new ReplyRepositoryPostgres(pool, () => '');

			expect(async () => replyRepository.verifyReplyOwner('user-abc234', 'reply-abc123'))
				.not.toThrowError('Reply not found');
			expect(async () => replyRepository.verifyReplyOwner('user-abc234', 'reply-abc123'))
				.not.toThrowError('You\'re prohibited to get access of this resource');
		});
	});

	describe('replyExists method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addReply({
				id: 'reply-abc123',
				content: 'a reply comment',
				replyTo: 'comment-abc123',
				userId: 'user-abc234',
			});
		});

		afterEach(async () => {
			await ThreadsTableTestHelper.hardRemoveReplies();
		});

		it('should return false when reply doesn\'t exist', async () => {
			const replyRepository = new ReplyRepositoryPostgres(pool, () => '');

			const exists = await replyRepository.replyExists('reply-abc');

			expect(exists).toBeFalsy();
		});

		it('should return true when reply exists', async () => {
			const replyRepository = new ReplyRepositoryPostgres(pool, () => '');

			const exists = await replyRepository.replyExists('reply-abc123');

			expect(exists).toBeTruthy();
		});
	});

	describe('getAllDetailedRepliesFromComment method', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.addReply({
				id: 'reply-abc123',
				content: 'a reply comment',
				replyTo: 'comment-abc123',
				userId: 'user-abc234',
				date: new Date(2022, 11, 12, 13, 45, 9),
			});
			await ThreadsTableTestHelper.addReply({
				id: 'reply-abc234',
				content: 'a reply comment 2',
				replyTo: 'comment-abc123',
				userId: 'user-abc123',
				date: new Date(2022, 11, 12, 16, 0, 10),
			});
		});

		afterEach(async () => {
			await ThreadsTableTestHelper.hardRemoveReplies();
		});

		it('should return a list of detailed replies from a comment', async () => {
			const replyRepository = new ReplyRepositoryPostgres(pool, () => '');

			const [, detailedReplies] = await replyRepository.getAllDetailedRepliesFromComment('comment-abc123');

			expect(detailedReplies).toHaveLength(2);
			expect(detailedReplies[0].id).toEqual('reply-abc123');
			expect(detailedReplies[0].username).toEqual('alice');
			expect(detailedReplies[0].content).toEqual('a reply comment');
			expect(detailedReplies[0].date).toEqual(new Date(2022, 11, 12, 13, 45, 9));
			expect(detailedReplies[1].id).toEqual('reply-abc234');
			expect(detailedReplies[1].username).toEqual('dicoding');
			expect(detailedReplies[1].content).toEqual('a reply comment 2');
			expect(detailedReplies[1].date).toEqual(new Date(2022, 11, 12, 16, 0, 10));
		});

		it('should return a list of detailed replies from a comment with 1 comment removed', async () => {
			const replyRepository = new ReplyRepositoryPostgres(pool, () => '');

			await replyRepository.removeReply('reply-abc123');
			const [, detailedReplies] = await replyRepository.getAllDetailedRepliesFromComment('comment-abc123');

			expect(detailedReplies).toHaveLength(2);
			expect(detailedReplies[0].id).toEqual('reply-abc123');
			expect(detailedReplies[0].username).toEqual('alice');
			expect(detailedReplies[0].content).toEqual('**balasan telah dihapus**');
			expect(detailedReplies[0].date).toEqual(new Date(2022, 11, 12, 13, 45, 9));
			expect(detailedReplies[1].id).toEqual('reply-abc234');
			expect(detailedReplies[1].username).toEqual('dicoding');
			expect(detailedReplies[1].content).toEqual('a reply comment 2');
			expect(detailedReplies[1].date).toEqual(new Date(2022, 11, 12, 16, 0, 10));
		});
	});
});
