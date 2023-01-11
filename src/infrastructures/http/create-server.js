import {server as hapiServer} from '@hapi/hapi';
import hapiPino from 'hapi-pino';
import hapiJwt from '@hapi/jwt';

import {usersPlugin} from '#interfaces/http/api/users/plugin.js';
import {authPlugin} from '#interfaces/http/api/authentications/plugin.js';
import {DomainErrorTranslator} from '#commons/exceptions/domain-error-translator.js';
import {ClientError} from '#commons/exceptions/client-error.js';
import {config} from '#infrastructures/config';

/**
 * @param {import("inversify").Container} container
 * @returns {Promise<import("@hapi/hapi").Server>}
 */
export async function createServer(container) {
	const server = hapiServer({
		host: config.http.host,
		port: config.http.port,
		debug: false,
	});

	await server.register([
		{
			// @ts-ignore
			plugin: hapiPino,
			options: {
				redact: ['req.headers.authorization'],
			},
		},
		{
			// @ts-ignore
			plugin: hapiJwt,
		},
	]);

	await server.register([
		{
			plugin: usersPlugin,
			options: {container},
		},
		{
			plugin: authPlugin,
			options: {container},
		},
	]);

	server.ext('onPreResponse', (request, h) => {
		const {response} = request;

		if (response instanceof Error) {
			const translatedError = DomainErrorTranslator.translate(response);
			// @ts-ignore
			request.logger.info(response.message);

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
