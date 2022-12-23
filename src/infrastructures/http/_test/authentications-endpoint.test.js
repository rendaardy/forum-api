import {describe, it, expect, afterEach, afterAll} from '@jest/globals';

import {container} from '#infrastructures/container';
import {createServer} from '../create-server.js';
import {pool} from '#infrastructures/database/postgres/pool.js';
import {AuthenticationsTableTestHelper} from '#tests/authentications-table-test-helper.js';
import {UsersTableTestHelper} from '#tests/users-table-test-helper.js';
import {AuthTokenManager} from '#applications/security/auth-token-manager.js';

describe('/authentications endpoint', () => {
	afterEach(async () => {
		await UsersTableTestHelper.clearTable();
		await AuthenticationsTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('POST /authentications', () => {
		it('should have response code 201 and send new token', async () => {
			const requestPayload = {
				username: 'dicoding',
				password: 'secret',
			};
			const server = await createServer(container);

			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			});

			const response = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: requestPayload,
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(json.status).toEqual('success');
			expect(json.data.accessToken).toBeDefined();
			expect(json.data.refreshToken).toBeDefined();
		});

		it('should have response code 400 if username isn\'t found', async () => {
			const requestPayload = {
				username: 'dicoding',
				password: 'secret',
			};
			const server = await createServer(container);

			const response = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: requestPayload,
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('Username not found');
		});

		it('should have response code 401 if password doesn\'t match', async () => {
			const requestPayload = {
				username: 'dicoding',
				password: 'wrong_password',
			};
			const server = await createServer(container);

			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			});

			const response = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: requestPayload,
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(401);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('Password does not match');
		});

		it('should have response code 400 when request payload doesn\'t contain the required property', async () => {
			const requestPayload = {
				username: 'dicoding',
			};
			const server = await createServer(container);

			const response = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: requestPayload,
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('username or password is required');
		});

		it('should have response code 400 when request payload isn\'t of type string', async () => {
			const requestPayload = {
				username: 123,
				password: 'secret',
			};
			const server = await createServer(container);

			const response = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: requestPayload,
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('username or password must be of type string');
		});
	});

	describe('PUT /authentications', () => {
		it('should have response code 200 and get a new access token', async () => {
			const server = await createServer(container);

			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			});

			const loginResponse = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			});
			const {data: {refreshToken}} = JSON.parse(loginResponse.payload);

			const response = await server.inject({
				method: 'PUT',
				url: '/authentications',
				payload: {
					refreshToken,
				},
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(json.status).toEqual('success');
			expect(json.data.accessToken).toBeDefined();
		});

		it('should have response code 400 when the payload doesn\'t contain refresh token', async () => {
			const server = await createServer(container);

			const response = await server.inject({
				method: 'PUT',
				url: '/authentications',
				payload: {},
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('refresh token is required');
		});

		it('should have response code 400 when refresh token isn\'t of type string', async () => {
			const server = await createServer(container);

			const response = await server.inject({
				method: 'PUT',
				url: '/authentications',
				payload: {
					refreshToken: 123,
				},
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('refresh token must be of type string');
		});

		it('should have response code 400 when refresh token is invalid', async () => {
			const server = await createServer(container);

			const response = await server.inject({
				method: 'PUT',
				url: '/authentications',
				payload: {
					refreshToken: 'invalid_refresh_token',
				},
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('invalid refresh token');
		});

		it('should have response code 400 when refresh token isn\'t in database', async () => {
			const server = await createServer(container);
			const refreshToken = await container.get(AuthTokenManager).createRefreshToken({username: 'dicoding'});

			const response = await server.inject({
				method: 'PUT',
				url: '/authentications',
				payload: {
					refreshToken,
				},
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('refresh token not found');
		});
	});

	describe('DELETE /authentications', () => {
		it('should have response code 200 when resresh token is valid', async () => {
			const server = await createServer(container);
			const refreshToken = 'refresh_token';

			await AuthenticationsTableTestHelper.addToken(refreshToken);

			const response = await server.inject({
				method: 'DELETE',
				url: '/authentications',
				payload: {
					refreshToken,
				},
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(json.status).toEqual('success');
		});

		it('should have response code 400 when refresh token isn\'t in database', async () => {
			const server = await createServer(container);
			const refreshToken = 'refresh_token';

			const response = await server.inject({
				method: 'DELETE',
				url: '/authentications',
				payload: {
					refreshToken,
				},
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('refresh token not found');
		});

		it('should have response code 400 when the payload doesn\'t contain refresh token', async () => {
			const server = await createServer(container);

			const response = await server.inject({
				method: 'DELETE',
				url: '/authentications',
				payload: {},
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('refresh token is required');
		});

		it('should have response code 400 when refresh token isn\'t of type string', async () => {
			const server = await createServer(container);

			const response = await server.inject({
				method: 'DELETE',
				url: '/authentications',
				payload: {
					refreshToken: 123,
				},
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('invalid refresh token');
		});
	});
});
