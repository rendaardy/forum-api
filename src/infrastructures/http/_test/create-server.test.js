import {describe, it, expect} from '@jest/globals';

import {container} from '#infrastructures/container';
import {createServer} from '../create-server.js';

describe('HTTP Server', () => {
	it('should have response code 404 when requesting to unregistered routes', async () => {
		const server = await createServer(container);

		const response = await server.inject({
			method: 'GET',
			url: '/any-route',
		});

		expect(response.statusCode).toEqual(404);
	});

	it('should handle server error', async () => {
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
			simulate: {
				error: true,
			},
		});

		const json = JSON.parse(response.payload);
		expect(response.statusCode).toEqual(500);
		expect(json.status).toEqual('error');
	});
});
