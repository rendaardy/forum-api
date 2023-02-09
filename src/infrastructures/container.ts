/* c8 ignore start */

import 'reflect-metadata';

import {env} from 'node:process';

import {Container, ContainerModule} from 'inversify';
import {helpers} from 'inversify-vanillajs-helpers';
import {nanoid} from 'nanoid';
import bcrypt from 'bcrypt';
import hapiJwt from '@hapi/jwt';

import {pool} from './database/postgres/pool.ts';
import {BcryptPasswordHash} from './security/bcrypt-password-hash.ts';
import {JwtTokenManager} from './security/jwt-token-manager.ts';
import {UserRepositoryPostgres} from './repository/user-repository-postgres.ts';
import {AuthenticationRepositoryPostgres} from './repository/authentication-repository-postgres.ts';
import {ThreadRepositoryPostgres} from './repository/thread-repository-postgres.ts';
import {CommentRepositoryPostgres} from './repository/comment-repository-postgres.ts';
import {ReplyRepositoryPostgres} from './repository/reply-repository-postgres.ts';

import {PasswordHash} from '#applications/security/password-hash.ts';
import {UserRepository} from '#domains/users/user-repository.ts';
import {AuthTokenManager} from '#applications/security/auth-token-manager.ts';
import {AuthenticationRepository} from '#domains/authentications/authentication-repository.ts';
import {ThreadRepository} from '#domains/threads/thread-repository.ts';
import {CommentRepository} from '#domains/threads/comment-repository.ts';
import {ReplyRepository} from '#domains/threads/reply-repository.ts';

import {AddUser} from '#applications/usecase/add-user.ts';
import {LoginUser} from '#applications/usecase/login-user.ts';
import {LogoutUser} from '#applications/usecase/logout-user.ts';
import {RefreshAuth} from '#applications/usecase/refresh-auth.ts';
import {DeleteAuth} from '#applications/usecase/delete-auth.ts';

import {AddThread} from '#applications/usecase/add-thread.ts';
import {AddComment} from '#applications/usecase/add-comment.ts';
import {RemoveComment} from '#applications/usecase/remove-comment.ts';
import {GetDetailedThread} from '#applications/usecase/get-detailed-thread.ts';
import {AddReply} from '#applications/usecase/add-reply.ts';
import {RemoveReply} from '#applications/usecase/remove-reply.ts';

/* eslint-disable @typescript-eslint/naming-convention */
export const Types = {
	Bcrypt: Symbol.for('bcrypt'),
	NanoId: Symbol.for('nanoid'),
	Postgres: Symbol.for('pg'),
	Jwt: Symbol.for('hapi-jwt'),
	AccessTokenKey: Symbol.for('accessTokenKey'),
	RefreshTokenKey: Symbol.for('refreshTokenKey'),
};
/* eslint-enable @typescript-eslint/naming-convention */

// Interfaces
helpers.annotate(UserRepository);
helpers.annotate(PasswordHash);
helpers.annotate(AuthenticationRepository);
helpers.annotate(AuthTokenManager);
helpers.annotate(ThreadRepository);
helpers.annotate(CommentRepository);
helpers.annotate(ReplyRepository);

// Implementations
helpers.annotate(BcryptPasswordHash, [Types.Bcrypt]);
helpers.annotate(JwtTokenManager, [Types.Jwt, Types.AccessTokenKey, Types.RefreshTokenKey]);
helpers.annotate(UserRepositoryPostgres, [Types.Postgres, Types.NanoId]);
helpers.annotate(AuthenticationRepositoryPostgres, [Types.Postgres]);
helpers.annotate(ThreadRepositoryPostgres, [Types.Postgres, Types.NanoId]);
helpers.annotate(CommentRepositoryPostgres, [Types.Postgres, Types.NanoId]);
helpers.annotate(ReplyRepositoryPostgres, [Types.Postgres, Types.NanoId]);

// Usecases
helpers.annotate(AddUser, [UserRepository, PasswordHash]);
helpers.annotate(LoginUser, [UserRepository, AuthenticationRepository, AuthTokenManager, PasswordHash]);
helpers.annotate(LogoutUser, [AuthenticationRepository]);
helpers.annotate(RefreshAuth, [AuthenticationRepository, AuthTokenManager]);
helpers.annotate(DeleteAuth, [AuthenticationRepository]);

helpers.annotate(AddThread, [ThreadRepository]);
helpers.annotate(AddComment, [ThreadRepository, CommentRepository]);
helpers.annotate(RemoveComment, [ThreadRepository, CommentRepository]);
helpers.annotate(GetDetailedThread, [ThreadRepository, CommentRepository, ReplyRepository]);
helpers.annotate(AddReply, [ThreadRepository, CommentRepository, ReplyRepository]);
helpers.annotate(RemoveReply, [ThreadRepository, CommentRepository, ReplyRepository]);

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
	bind(CommentRepository).to(CommentRepositoryPostgres);
	bind(ReplyRepository).to(ReplyRepositoryPostgres);

	bind(AddUser).to(AddUser);
	bind(LoginUser).to(LoginUser);
	bind(LogoutUser).to(LogoutUser);
	bind(RefreshAuth).to(RefreshAuth);
	bind(DeleteAuth).to(DeleteAuth);

	bind(AddThread).toSelf();
	bind(AddComment).toSelf();
	bind(RemoveComment).toSelf();
	bind(GetDetailedThread).toSelf();
	bind(AddReply).toSelf();
	bind(RemoveReply).toSelf();
});

export const container = new Container();
container.load(thirdPartyModule, applicationModule);

/* c8 ignore stop */
