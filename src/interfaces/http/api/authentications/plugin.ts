/* eslint-disable @typescript-eslint/consistent-type-definitions */

import {LoginUser} from '#applications/usecase/login-user.ts';
import {LogoutUser} from '#applications/usecase/logout-user.ts';
import {RefreshAuth} from '#applications/usecase/refresh-auth.ts';
import {
	postAuthentications,
	putAuthentications,
	deleteAuthentications,
} from './handlers.ts';

import type {Container} from 'inversify';
import type {Plugin} from '@hapi/hapi';

type AuthPluginOpts = {
	container: Container;
};

export const authPlugin: Plugin<AuthPluginOpts> = {
	name: 'forum-api/auth',
	async register(server, opts) {
		const {container} = opts;
		const loginUser = container.get(LoginUser);
		const logoutUser = container.get(LogoutUser);
		const refreshAuth = container.get(RefreshAuth);

		server.method('loginUser', loginUser.execute, {bind: loginUser});
		server.method('logoutUser', logoutUser.execute, {bind: logoutUser});
		server.method('refreshAuth', refreshAuth.execute, {bind: refreshAuth});

		server.route([
			{
				method: 'POST',
				path: '/authentications',
				handler: postAuthentications,
			},
			{
				method: 'PUT',
				path: '/authentications',
				handler: putAuthentications,
			},
			{
				method: 'DELETE',
				path: '/authentications',
				handler: deleteAuthentications,
			},
		]);
	},
};

declare module '@hapi/hapi' {
	interface ServerMethods {
		loginUser: typeof LoginUser.prototype.execute;
		logoutUser: typeof LogoutUser.prototype.execute;
		refreshAuth: typeof RefreshAuth.prototype.execute;
	}
}
