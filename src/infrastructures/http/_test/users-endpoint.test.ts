/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {describe, it, expect, afterEach, afterAll} from '@jest/globals';

import {pool} from '#infrastructures/database/postgres/pool.ts';
import {UsersTableTestHelper} from '#tests/users-table-test-helper.ts';
import {container} from '#infrastructures/container';
import {createServer} from '../create-server.ts';

describe('/users endpoint', () => {
	afterAll(async () => {
		await pool.end();
	});

	afterEach(async () => {
		await UsersTableTestHelper.clearTable();
	});

	describe('POST /users', () => {
		it('should have response code 201 and save user to DB', async () => {
			const requestPayload = {
				username: 'dicoding',
				password: 'secret',
				fullname: 'Dicoding Indonesia',
			};
			const server = await createServer(container);

			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(json.status).toEqual('success');
			expect(json.data.addedUser).toBeDefined();
		});

		it('should have response code 400 when the request payload doesn\'t meet the required properties', async () => {
			const requestPayload = {
				fullname: 'Dicoding',
				password: 'secret',
			};
			const server = await createServer(container);

			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('Failed to create a new user. Missing the required properties');
		});

		it('should have response code 400 when the request payload has type mismatch', async () => {
			const requestPayload = {
				username: 'dicoding',
				password: 'secret',
				fullname: ['Dicoding Indonesia'],
			};
			const server = await createServer(container);

			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('Failed to create a new user. Type mismatch');
		});

		it('should have response code 400 when username has more than 50 characters', async () => {
			const requestPayload = {
				username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicodingindonesiadicodingindonesia',
				password: 'secret',
				fullname: 'Dicoding Indonesia',
			};
			const server = await createServer(container);

			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('Failed to create a new user. Username reaches more than 50 characters');
		});

		it('should have response code 400 when username contains forbidden characters', async () => {
			const requestPayload = {
				username: 'dicoding indonesia',
				password: 'secret',
				fullname: 'Dicoding Indonesia',
			};
			const server = await createServer(container);

			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
		});

		it('should have response code 400 when username isn\'t available', async () => {
			await UsersTableTestHelper.addUser({username: 'dicoding'});

			const requestPayload = {
				username: 'dicoding',
				password: 'super_secret',
				fullname: 'Dicoding Indonesia',
			};
			const server = await createServer(container);

			const response = await server.inject({
				method: 'POST',
				url: '/users',
				payload: requestPayload,
			});

			const json = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(json.status).toEqual('fail');
			expect(json.message).toEqual('username tidak tersedia');
		});
	});
});
