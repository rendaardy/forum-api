/* c8 ignore start */

import 'reflect-metadata';

import {env} from 'node:process';

import {decorate, inject, injectable, Container, ContainerModule} from 'inversify';
import {nanoid} from 'nanoid';
import bcrypt from 'bcrypt';
import hapiJwt from '@hapi/jwt';

import {pool} from './database/postgres/pool.js';
import {BcryptPasswordHash} from './security/bcrypt-password-hash.js';
import {JwtTokenManager} from './security/jwt-token-manager.js';
import {UserRepositoryPostgres} from './repository/user-repository-postgres.js';
import {AuthenticationRepositoryPostgres} from './repository/authentication-repository-postgres.js';

import {PasswordHash} from '#applications/security/password-hash.js';
import {UserRepository} from '#domains/users/user-repository.js';
import {AuthTokenManager} from '#applications/security/auth-token-manager.js';
import {AuthenticationRepository} from '#domains/authentications/authentication-repository.js';

import {AddUser} from '#applications/usecase/add-user.js';
import {LoginUser} from '#applications/usecase/login-user.js';
import {LogoutUser} from '#applications/usecase/logout-user.js';
import {RefreshAuth} from '#applications/usecase/refresh-auth.js';
import {DeleteAuth} from '#applications/usecase/delete-auth.js';

export const Types = {
	Bcrypt: Symbol.for('bcrypt'),
	NanoId: Symbol.for('nanoid'),
	Postgres: Symbol.for('pg'),
	Jwt: Symbol.for('hapi-jwt'),
	AccessTokenKey: Symbol.for('accessTokenKey'),
	RefreshTokenKey: Symbol.for('refreshTokenKey'),
};

// Interfaces
decorate(injectable(), UserRepository);
decorate(injectable(), PasswordHash);
decorate(injectable(), AuthenticationRepository);
decorate(injectable(), AuthTokenManager);

// Implementations
decorate(injectable(), BcryptPasswordHash);
decorate(inject(Types.Bcrypt), BcryptPasswordHash, 0);

decorate(injectable(), JwtTokenManager);
decorate(inject(Types.Jwt), JwtTokenManager, 0);
decorate(inject(Types.AccessTokenKey), JwtTokenManager, 1);
decorate(inject(Types.RefreshTokenKey), JwtTokenManager, 2);

decorate(injectable(), UserRepositoryPostgres);
decorate(inject(Types.Postgres), UserRepositoryPostgres, 0);
decorate(inject(Types.NanoId), UserRepositoryPostgres, 1);

decorate(injectable(), AuthenticationRepositoryPostgres);
decorate(inject(Types.Postgres), AuthenticationRepositoryPostgres, 0);

// Usecases
decorate(injectable(), AddUser);
decorate(inject(UserRepository), AddUser, 0);
decorate(inject(PasswordHash), AddUser, 1);

decorate(injectable(), LoginUser);
decorate(inject(UserRepository), LoginUser, 0);
decorate(inject(AuthenticationRepository), LoginUser, 1);
decorate(inject(AuthTokenManager), LoginUser, 2);
decorate(inject(PasswordHash), LoginUser, 3);

decorate(injectable(), LogoutUser);
decorate(inject(AuthenticationRepository), LogoutUser, 0);

decorate(injectable(), RefreshAuth);
decorate(inject(AuthenticationRepository), RefreshAuth, 0);
decorate(inject(AuthTokenManager), RefreshAuth, 1);

decorate(injectable(), DeleteAuth);
decorate(inject(AuthenticationRepository), DeleteAuth, 0);

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

	bind(AddUser).to(AddUser);
	bind(LoginUser).to(LoginUser);
	bind(LogoutUser).to(LogoutUser);
	bind(RefreshAuth).to(RefreshAuth);
	bind(DeleteAuth).to(DeleteAuth);
});

export const container = new Container();
container.load(thirdPartyModule, applicationModule);

/* c8 ignore stop */
