/* eslint-disable @typescript-eslint/consistent-type-definitions */

import {AddUser} from '#applications/usecase/add-user.ts';
import {postUsersHandler} from './handlers.ts';

import type {Container} from 'inversify';
import type {Plugin} from '@hapi/hapi';

export type UsersPluginOpts = {
	container: Container;
};

export const usersPlugin: Plugin<UsersPluginOpts> = {
	name: 'forum-api/users',
	async register(server, opts) {
		const addUser = opts.container.get(AddUser);

		server.method('addUser', addUser.execute, {bind: addUser});

		server.route([
			{
				method: 'POST',
				path: '/users',
				handler: postUsersHandler,
			},
		]);
	},
};

declare module '@hapi/hapi' {
	interface ServerMethods {
		addUser: typeof AddUser.prototype.execute;
	}
}
