import {AddUser} from '#applications/usecase/add-user.js';
import {postUsersHandler} from './handlers.js';

/**
 * @typedef {import("./plugin.js").UsersPluginOpts} UsersPluginOpts
 */

/** @type {import("@hapi/hapi").Plugin<UsersPluginOpts>} */
export const usersPlugin = {
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
