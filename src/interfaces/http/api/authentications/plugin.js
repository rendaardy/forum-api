import {LoginUser} from '#applications/usecase/login-user.js';
import {LogoutUser} from '#applications/usecase/logout-user.js';
import {RefreshAuth} from '#applications/usecase/refresh-auth.js';
import {
	postAuthentications,
	putAuthentications,
	deleteAuthentications,
} from './handlers.js';

/**
 * @typedef {object} AuthPluginOpts
 * @property {import("inversify").Container} container
 */

/** @type {import("@hapi/hapi").Plugin<AuthPluginOpts>} */
export const authPlugin = {
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
