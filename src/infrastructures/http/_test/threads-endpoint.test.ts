/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import {describe, it, expect, beforeEach, beforeAll, afterEach, afterAll} from '@jest/globals';

import {pool} from '#infrastructures/database/postgres/pool.ts';
import {container} from '#infrastructures/container';
import {createServer} from '#infrastructures/http/create-server.ts';
import {AuthenticationsTableTestHelper} from '#tests/authentications-table-test-helper.ts';
import {UsersTableTestHelper} from '#tests/users-table-test-helper.ts';
import {ThreadsTableTestHelper} from '#tests/threads-table-test-helper.ts';

describe('/threads endpoint', () => {
	let server: Awaited<ReturnType<typeof createServer>>;

	beforeAll(async () => {
		server = await createServer(container);

		await server.inject({
			url: '/users',
			method: 'POST',
			payload: {
				username: 'dicoding',
				password: 'secret_password',
				fullname: 'Dicoding Indonesia',
			},
		});
		await server.inject({
			url: '/users',
			method: 'POST',
			payload: {
				username: 'alice',
				password: 'secret_password',
				fullname: 'Alice',
			},
		});
		await server.inject({
			url: '/users',
			method: 'POST',
			payload: {
				username: 'bob',
				password: 'secret_password',
				fullname: 'Bob',
			},
		});
	});

	afterEach(async () => {
		await ThreadsTableTestHelper.clearTable();
	});

	afterAll(async () => {
		await AuthenticationsTableTestHelper.cleanTable();
		await UsersTableTestHelper.clearTable();
		await pool.end();
	});

	describe('POST /threads', () => {
		let accessToken = '';
		let refreshToken = '';

		beforeEach(async () => {
			// Login with dicoding username
			const authResponse = await server.inject({
				url: '/authentications',
				method: 'POST',
				payload: {
					username: 'dicoding',
					password: 'secret_password',
				},
			});
			const authJson = JSON.parse(authResponse.payload);
			accessToken = authJson.data.accessToken;
			refreshToken = authJson.data.refreshToken;
		});

		afterEach(async () => {
			// Logout
			await server.inject({
				url: '/authentications',
				method: 'DELETE',
				payload: {
					refreshToken,
				},
			});

			accessToken = '';
			refreshToken = '';
		});

		it('should response with status code 201 and payload successfully', async () => {
			const response = await server.inject({
				url: '/threads',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					title: 'a thread',
					body: 'a thread body',
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(jsonResponse.status).toEqual('success');
			expect(jsonResponse.data.addedThread).toBeDefined();
		});

		it('should return response code 400 when the request payload doesn\'t meet the required properties', async () => {
			const response = await server.inject({
				url: '/threads',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					title: 'a thread',
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to create a new thread. Missing the required properties');
		});

		it('should return response code 400 when the request payload has type mismatch', async () => {
			const response = await server.inject({
				url: '/threads',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					title: 'a thread',
					body: 123,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to create a new thread. Type mismatch');
		});

		it('should return response code 401 when the user tries to create a new thread before authenticate itself', async () => {
			const response = await server.inject({
				url: '/threads',
				method: 'POST',
				payload: {
					title: 'a thread',
					body: 'a thread body',
				},
			});

			expect(response.statusCode).toEqual(401);
		});
	});

	describe('POST /threads/{threadId}/comments', () => {
		let accessToken = '';
		let refreshToken = '';
		let threadId: string;

		beforeEach(async () => {
			// Login with dicoding username
			const authResponse = await server.inject({
				url: '/authentications',
				method: 'POST',
				payload: {
					username: 'dicoding',
					password: 'secret_password',
				},
			});
			const authJson = JSON.parse(authResponse.payload);
			accessToken = authJson.data.accessToken;
			refreshToken = authJson.data.refreshToken;

			// Create a new thread using dicoding username
			const response = await server.inject({
				url: '/threads',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					title: 'a thread',
					body: 'a thread body',
				},
			});
			const json = JSON.parse(response.payload);
			threadId = json.data.addedThread.id;
		});

		afterEach(async () => {
			// Logout
			await server.inject({
				url: '/authentications',
				method: 'DELETE',
				payload: {
					refreshToken,
				},
			});

			accessToken = '';
			refreshToken = '';
			threadId = '';
		});

		it('should return response code 201 and payload successfully', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					content: 'a comment',
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(jsonResponse.status).toEqual('success');
			expect(jsonResponse.data.addedComment).toBeDefined();
		});

		it('should return response code 400 when the request payload doesn\'t meet the required properties', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to create a new comment. Missing the required properties');
		});

		it('should return response code 400 when the request payload has type mismatch', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					content: 123,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to create a new comment. Type mismatch');
		});

		it('should return response code 401 when the user tries to create a new comment before authenticate itself', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments`,
				method: 'POST',
				payload: {
					content: 'a comment',
				},
			});

			expect(response.statusCode).toEqual(401);
		});

		it('should return response code 404 when the user tries to create a new comment in a non-existing thread', async () => {
			const response = await server.inject({
				url: '/threads/thread-abc123/comments',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					content: 'a comment',
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to create a new comment. Thread not found');
		});
	});

	describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
		let accessToken = '';
		let refreshToken = '';
		let threadId: string;
		let commentId: string;

		beforeEach(async () => {
			// Login with dicoding username
			const authResponse = await server.inject({
				url: '/authentications',
				method: 'POST',
				payload: {
					username: 'dicoding',
					password: 'secret_password',
				},
			});
			const authJson = JSON.parse(authResponse.payload);
			accessToken = authJson.data.accessToken;
			refreshToken = authJson.data.refreshToken;

			// Create a new thread using dicoding username
			const threadResponse = await server.inject({
				url: '/threads',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					title: 'a thread',
					body: 'a thread body',
				},
			});
			let json = JSON.parse(threadResponse.payload);
			threadId = json.data.addedThread.id;

			// Create a new comment using dicoding username
			const commentResponse = await server.inject({
				url: `/threads/${threadId}/comments`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					content: 'a comment',
				},
			});

			json = JSON.parse(commentResponse.payload);
			commentId = json.data.addedComment.id;
		});

		afterEach(async () => {
			// Logout
			await server.inject({
				url: '/authentications',
				method: 'DELETE',
				payload: {
					refreshToken,
				},
			});

			accessToken = '';
			refreshToken = '';
			threadId = '';
			commentId = '';
		});

		it('should return response code 200 successfully', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(jsonResponse.status).toEqual('success');
		});

		it('should return response code 401 when the user tries to remove a comment before authenticate itself', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}`,
				method: 'DELETE',
			});

			expect(response.statusCode).toEqual(401);
		});

		it('should return response code 403 when the user tries to remove a comment that isn\'t owned', async () => {
			const aliceResponse = await server.inject({
				url: '/authentications',
				method: 'POST',
				payload: {
					username: 'alice',
					password: 'secret_password',
				},
			});
			const aliceJsonResponse = JSON.parse(aliceResponse.payload);
			const aliceAccessToken = aliceJsonResponse.data.accessToken;

			const response = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${aliceAccessToken}`,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(403);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('You\'re prohibited to get access of this resource');
		});

		it('should return response code 404 when removing a comment on a non-existing thread', async () => {
			const response = await server.inject({
				url: `/threads/thread-abc/comments/${commentId}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to remove a comment. Thread not found');
		});

		it('should return response code 404 when removing a non-existing comment', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/comment-abc`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Comment not found');
		});
	});

	describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
		let accessToken = '';
		let refreshToken = '';
		let threadId: string;
		let commentId: string;

		beforeEach(async () => {
			// Login with dicoding username
			let authResponse = await server.inject({
				url: '/authentications',
				method: 'POST',
				payload: {
					username: 'dicoding',
					password: 'secret_password',
				},
			});
			let authJson = JSON.parse(authResponse.payload);
			accessToken = authJson.data.accessToken;
			refreshToken = authJson.data.refreshToken;

			// Create a new thread using dicoding username
			let response = await server.inject({
				url: '/threads',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					title: 'a thread',
					body: 'a thread body',
				},
			});
			let json = JSON.parse(response.payload);
			threadId = json.data.addedThread.id;

			// Logout
			await server.inject({
				url: '/authentications',
				method: 'DELETE',
				payload: {
					refreshToken,
				},
			});

			accessToken = '';
			refreshToken = '';

			// Login with alice username to create a new comment
			authResponse = await server.inject({
				url: '/authentications',
				method: 'POST',
				payload: {
					username: 'alice',
					password: 'secret_password',
				},
			});
			authJson = JSON.parse(authResponse.payload);
			accessToken = authJson.data.accessToken;
			refreshToken = authJson.data.refreshToken;

			// Create a new comment using alice username
			response = await server.inject({
				url: `/threads/${threadId}/comments`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					content: 'a comment',
				},
			});
			json = JSON.parse(response.payload);
			commentId = json.data.addedComment.id;
		});

		afterEach(async () => {
			// Logout
			await server.inject({
				url: '/authentications',
				method: 'DELETE',
				payload: {
					refreshToken,
				},
			});

			accessToken = '';
			refreshToken = '';
			threadId = '';
			commentId = '';
		});

		it('should return response code 201 and payload successfully', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}/replies`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					content: 'a reply comment',
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(jsonResponse.status).toEqual('success');
			expect(jsonResponse.data.addedReply).toBeDefined();
		});

		it('should return response code 400 when the request payload doesn\'t meet the required properties', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}/replies`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to create a new reply. Missing the required properties');
		});

		it('should return response code 400 when the request payload has type mismatch', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}/replies`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					content: 123,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to create a new reply. Type mismatch');
		});

		it('should return response code 401 when the user tries to create a new reply before authenticate itself', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}/replies`,
				method: 'POST',
				payload: {
					content: 'a reply comment',
				},
			});

			expect(response.statusCode).toEqual(401);
		});

		it('should return response code 404 when the user tries to create a new reply in a non-existing thread', async () => {
			const response = await server.inject({
				url: `/threads/thread-abc123/comments/${commentId}/replies`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					content: 'a reply comment',
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to create a new reply. Thread not found');
		});

		it('should return response code 404 when the user tries to create a new reply in a non-existing comment', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/comment-abc/replies`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					content: 'a reply comment',
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to create a new reply. Comment not found');
		});
	});

	describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
		let accessToken = '';
		let refreshToken = '';
		let threadId: string;
		let commentId: string;
		let replyId: string;

		beforeEach(async () => {
			// Login with dicoding username
			const authResponse = await server.inject({
				url: '/authentications',
				method: 'POST',
				payload: {
					username: 'dicoding',
					password: 'secret_password',
				},
			});
			const authJson = JSON.parse(authResponse.payload);
			accessToken = authJson.data.accessToken;
			refreshToken = authJson.data.refreshToken;

			// Create a new thread using dicoding username
			const threadResponse = await server.inject({
				url: '/threads',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					title: 'a thread',
					body: 'a thread body',
				},
			});
			let json = JSON.parse(threadResponse.payload);
			threadId = json.data.addedThread.id;

			// Create a new comment using dicoding username
			const commentResponse = await server.inject({
				url: `/threads/${threadId}/comments`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					content: 'a comment',
				},
			});

			json = JSON.parse(commentResponse.payload);
			commentId = json.data.addedComment.id;

			// Create a new reply using dicoding username
			const replyResponse = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}/replies`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				payload: {
					content: 'a reply comment',
				},
			});

			json = JSON.parse(replyResponse.payload);
			replyId = json.data.addedReply.id;
		});

		afterEach(async () => {
			// Logout
			await server.inject({
				url: '/authentications',
				method: 'DELETE',
				payload: {
					refreshToken,
				},
			});

			accessToken = '';
			refreshToken = '';
			threadId = '';
			commentId = '';
		});

		it('should return response code 200 successfully', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(jsonResponse.status).toEqual('success');
		});

		it('should return response code 401 when the user tries to remove a reply before authenticate itself', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
				method: 'DELETE',
			});

			expect(response.statusCode).toEqual(401);
		});

		it('should return response code 403 when the user tries to remove a reply that isn\'t owned', async () => {
			const aliceResponse = await server.inject({
				url: '/authentications',
				method: 'POST',
				payload: {
					username: 'alice',
					password: 'secret_password',
				},
			});
			const aliceJsonResponse = JSON.parse(aliceResponse.payload);
			const aliceAccessToken = aliceJsonResponse.data.accessToken;

			const response = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${aliceAccessToken}`,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(403);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('You\'re prohibited to get access of this resource');
		});

		it('should return response code 404 when removing a reply on a non-existing thread', async () => {
			const response = await server.inject({
				url: `/threads/thread-abc/comments/${commentId}/replies/${replyId}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to remove a reply. Thread not found');
		});

		it('should return response code 404 when removing a reply on a non-existing comment', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/comment-abc/replies/${replyId}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to remove a reply. Comment not found');
		});

		it('should return response code 404 when removing a non-existing reply', async () => {
			const response = await server.inject({
				url: `/threads/${threadId}/comments/${commentId}/replies/comment-abc`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Reply not found');
		});
	});

	describe('GET /threads/{threadId}', () => {
		beforeEach(async () => {
			await ThreadsTableTestHelper.clearTable();
			await UsersTableTestHelper.clearTable();

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

			await ThreadsTableTestHelper.addThread({
				id: 'thread-abc123',
				title: 'first thread',
				body: 'first thread body',
				userId: 'user-abc123',
			});
			await ThreadsTableTestHelper.addThread({
				id: 'thread-abc234',
				title: 'second thread',
				body: 'second thread body',
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

		afterEach(async () => {
			await ThreadsTableTestHelper.clearTable();
			await UsersTableTestHelper.clearTable();
		});

		it('should return response code 404 when fetching a non-existing thread', async () => {
			const response = await server.inject({
				url: '/threads/thread-abc',
				method: 'GET',
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(jsonResponse.status).toEqual('fail');
			expect(jsonResponse.message).toEqual('Failed to retrieve a thread. Thread not found');
		});

		it('should return response code 200 along with the response payload that contains a detailed thread', async () => {
			const response = await server.inject({
				url: '/threads/thread-abc123',
				method: 'GET',
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(jsonResponse.status).toEqual('success');
			expect(jsonResponse.data.thread).toBeDefined();

			const {thread} = jsonResponse.data;
			expect(thread.id).toEqual('thread-abc123');
			expect(thread.title).toEqual('first thread');
			expect(thread.body).toEqual('first thread body');
			expect(thread.username).toEqual('dicoding');
			expect(thread.comments).toBeInstanceOf(Array);
			expect(thread.comments).toHaveLength(2);
			expect(thread.comments[0].id).toEqual('comment-abc123');
			expect(thread.comments[0].username).toEqual('alice');
			expect(thread.comments[0].content).toEqual('a comment');
			expect(thread.comments[1].id).toEqual('comment-abc234');
			expect(thread.comments[1].username).toEqual('bob');
			expect(thread.comments[1].content).toEqual('a comment 2');
		});

		it('should return response code 200 along with the response payload that contains a detailed thread with one comment removed', async () => {
			await ThreadsTableTestHelper.removeCommentById('comment-abc234');

			const response = await server.inject({
				url: '/threads/thread-abc123',
				method: 'GET',
			});

			const jsonResponse = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(jsonResponse.status).toEqual('success');
			expect(jsonResponse.data.thread).toBeDefined();

			const {thread} = jsonResponse.data;
			expect(thread.id).toEqual('thread-abc123');
			expect(thread.title).toEqual('first thread');
			expect(thread.body).toEqual('first thread body');
			expect(thread.username).toEqual('dicoding');
			expect(thread.comments).toBeInstanceOf(Array);
			expect(thread.comments).toHaveLength(2);
			expect(thread.comments[0].id).toEqual('comment-abc123');
			expect(thread.comments[0].username).toEqual('alice');
			expect(thread.comments[0].content).toEqual('a comment');
			expect(thread.comments[1].id).toEqual('comment-abc234');
			expect(thread.comments[1].username).toEqual('bob');
			expect(thread.comments[1].content).toEqual('**komentar telah dihapus**');
		});
	});
});
