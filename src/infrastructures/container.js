/* c8 ignore start */

import 'reflect-metadata';

import {env} from 'node:process';

import {Container, ContainerModule} from 'inversify';
import {helpers} from 'inversify-vanillajs-helpers';
import {nanoid} from 'nanoid';
import bcrypt from 'bcrypt';
import hapiJwt from '@hapi/jwt';

import {pool} from './database/postgres/pool.js';
import {BcryptPasswordHash} from './security/bcrypt-password-hash.js';
import {JwtTokenManager} from './security/jwt-token-manager.js';
import {UserRepositoryPostgres} from './repository/user-repository-postgres.js';
import {AuthenticationRepositoryPostgres} from './repository/authentication-repository-postgres.js';
import {ThreadRepositoryPostgres} from './repository/thread-repository-postgres.js';

import {PasswordHash} from '#applications/security/password-hash.js';
import {UserRepository} from '#domains/users/user-repository.js';
import {AuthTokenManager} from '#applications/security/auth-token-manager.js';
import {AuthenticationRepository} from '#domains/authentications/authentication-repository.js';
import {ThreadRepository} from '#domains/threads/thread-repository.js';

import {AddUser} from '#applications/usecase/add-user.js';
import {LoginUser} from '#applications/usecase/login-user.js';
import {LogoutUser} from '#applications/usecase/logout-user.js';
import {RefreshAuth} from '#applications/usecase/refresh-auth.js';
import {DeleteAuth} from '#applications/usecase/delete-auth.js';

import {AddThread} from '#applications/usecase/add-thread.js';
import {AddComment} from '#applications/usecase/add-comment.js';
import {RemoveComment} from '#applications/usecase/remove-comment.js';
import {GetDetailedThread} from '#applications/usecase/get-detailed-thread.js';

export const Types = {
	Bcrypt: Symbol.for('bcrypt'),
	NanoId: Symbol.for('nanoid'),
	Postgres: Symbol.for('pg'),
	Jwt: Symbol.for('hapi-jwt'),
	AccessTokenKey: Symbol.for('accessTokenKey'),
	RefreshTokenKey: Symbol.for('refreshTokenKey'),
};

// Interfaces
helpers.annotate(UserRepository);
helpers.annotate(PasswordHash);
helpers.annotate(AuthenticationRepository);
helpers.annotate(AuthTokenManager);
helpers.annotate(ThreadRepository);

// Implementations
helpers.annotate(BcryptPasswordHash, [Types.Bcrypt]);
helpers.annotate(JwtTokenManager, [Types.Jwt, Types.AccessTokenKey, Types.RefreshTokenKey]);
helpers.annotate(UserRepositoryPostgres, [Types.Postgres, Types.NanoId]);
helpers.annotate(AuthenticationRepositoryPostgres, [Types.Postgres]);
helpers.annotate(ThreadRepositoryPostgres, [Types.Postgres, Types.NanoId]);

// Usecases
helpers.annotate(AddUser, [UserRepository, PasswordHash]);
helpers.annotate(LoginUser, [UserRepository, AuthenticationRepository, AuthTokenManager, PasswordHash]);
helpers.annotate(LogoutUser, [AuthenticationRepository]);
helpers.annotate(RefreshAuth, [AuthenticationRepository, AuthTokenManager]);
helpers.annotate(DeleteAuth, [AuthenticationRepository]);

helpers.annotate(AddThread, [UserRepository, ThreadRepository]);
helpers.annotate(AddComment, [UserRepository, ThreadRepository]);
helpers.annotate(RemoveComment, [UserRepository, ThreadRepository]);
helpers.annotate(GetDetailedThread, [ThreadRepository]);

const thirdPartyModule = new ContainerModule(bind => {
	bind(Types.Bcrypt).toConstantValue(bcrypt);
	bind(Types.NanoId).toConstantValue(nanoid);
	bind(Types.Postgres).toConstantValue(pool);
	bind(Types.Jwt).toConstantValue(hapiJwt.token);
});

const applicationModule = new ContainerModule(bind => {
	bind(Types.AccessTokenKey).toConstantValue(env.ACCESS_TOKEN_KEY);
	bind(Types.RefreshTokenKey).toConstantValue(env.REFRESH_TOKEN_KEY);

	bind(PasswordHash).to(BcryptPasswordHash);
	bind(AuthTokenManager).to(JwtTokenManager);
	bind(UserRepository).to(UserRepositoryPostgres);
	bind(AuthenticationRepository).to(AuthenticationRepositoryPostgres);
	bind(ThreadRepository).to(ThreadRepositoryPostgres);

	bind(AddUser).to(AddUser);
	bind(LoginUser).to(LoginUser);
	bind(LogoutUser).to(LogoutUser);
	bind(RefreshAuth).to(RefreshAuth);
	bind(DeleteAuth).to(DeleteAuth);

	bind(AddThread).toSelf();
	bind(AddComment).toSelf();
	bind(RemoveComment).toSelf();
	bind(GetDetailedThread).toSelf();
});

export const container = new Container();
container.load(thirdPartyModule, applicationModule);

/* c8 ignore stop */
