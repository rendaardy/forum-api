import type {Container} from 'inversify';
import type {Plugin} from '@hapi/hapi';

import type {AddUser} from '#applications/usecase/add-user.js';

export type UsersPluginOpts = {
	container: Container;
};

export declare const usersPlugin: Plugin<UsersPluginOpts>;

declare module '@hapi/hapi' {
	type ServerMethods = {
		addUser: typeof AddUser.prototype.execute;
	};
}
