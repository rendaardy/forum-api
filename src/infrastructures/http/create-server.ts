import {server as hapiServer} from '@hapi/hapi';
import hapiPino from 'hapi-pino';
import hapiJwt from '@hapi/jwt';

import {usersPlugin} from '#interfaces/http/api/users/plugin.ts';
import {authPlugin} from '#interfaces/http/api/authentications/plugin.ts';
import {threadsPlugin} from '#interfaces/http/api/threads/plugin.ts';
import {DomainErrorTranslator} from '#commons/exceptions/domain-error-translator.ts';
import {ClientError} from '#commons/exceptions/client-error.ts';
import {config} from '#infrastructures/config';

import type {Container} from 'inversify';
import type {Server} from '@hapi/hapi';

export async function createServer(container: Container): Promise<Server> {
	const server = hapiServer({
		host: config.http.host,
		port: config.http.port,
		debug: false,
	});

	await server.register([
		{
			// @ts-expect-error avoid type error
			plugin: hapiPino,
			options: {
				redact: ['req.headers.authorization'],
			},
		},
		{
			// @ts-expect-error avoid type error
			plugin: hapiJwt,
		},
	]);

	server.auth.strategy('forum-api_jwt', 'jwt', {
		keys: config.jwt.accessTokenKey,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: config.jwt.tokenAge,
		},
		/* eslint-disable @typescript-eslint/no-unsafe-assignment */
		validate(artifacts: any) {
			return {
				isValid: true,
				credentials: {
					id: artifacts.decoded.payload.id,
					username: artifacts.decoded.payload.username,
				},
			};
		},
		/* eslint-enable @typescript-eslint/no-unsafe-assignment */
	});

	await server.register([
		{
			plugin: usersPlugin,
			options: {container},
		},
		{
			plugin: authPlugin,
			options: {container},
		},
		{
			plugin: threadsPlugin,
			options: {container},
		},
	]);

	server.ext('onPreResponse', (request, h) => {
		const {response} = request;

		if (response instanceof Error) {
			const translatedError = DomainErrorTranslator.translate(response);
			// @ts-expect-error avoid type error
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			request.logger.error(translatedError);

			if (translatedError instanceof ClientError) {
				const newResponse = h.response({
					status: 'fail',
					message: translatedError.message,
				});
				newResponse.code(translatedError.statusCode);
				return newResponse;
			}

			if (!response.isServer) {
				return h.continue;
			}

			const newResponse = h.response({
				status: 'error',
				message: 'Internal server error',
			});
			newResponse.code(500);
			return newResponse;
		}

		return h.continue;
	});

	return server;
}
