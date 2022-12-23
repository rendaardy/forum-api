import {describe, it, expect, jest} from '@jest/globals';
import hapiJwt from '@hapi/jwt';

import {InvariantError} from '#commons/exceptions/invariant-error.js';
import {JwtTokenManager} from '../jwt-token-manager.js';

describe('JwtTokenManager', () => {
	describe('createAccessToken method', () => {
		it('should throw an error when access token key is not set', async () => {
			const payload = {
				username: 'dicoding',
			};
			const mockJwtToken = {
				generate: jest.fn().mockImplementation(() => 'mock_token'),
			};
			const jwtTokenManager = new JwtTokenManager(/** @type {any} */(mockJwtToken), '', '');

			await expect(jwtTokenManager.createAccessToken(payload)).rejects
				.toThrowError('ACCESS_TOKEN_KEY must be set');
		});

		it('should create accessToken correctly', async () => {
			const payload = {
				username: 'dicoding',
			};
			const mockJwtToken = {
				generate: jest.fn().mockImplementation(() => 'mock_token'),
			};
			const accessTokenKey = 'access_token_key';
			const refreshTokenKey = 'refresh_token_key';
			const jwtTokenManager = new JwtTokenManager(/** @type {any} */(mockJwtToken), accessTokenKey, refreshTokenKey);

			const accessToken = await jwtTokenManager.createAccessToken(payload);

			expect(mockJwtToken.generate).toBeCalledWith(payload, accessTokenKey);
			expect(accessToken).toEqual('mock_token');
		});
	});

	describe('createRefreshToken method', () => {
		it('should throw an error when refresh token key is not set', async () => {
			const payload = {
				username: 'dicoding',
			};
			const mockJwtToken = {
				generate: jest.fn().mockImplementation(() => 'mock_token'),
			};
			const jwtTokenManager = new JwtTokenManager(/** @type {any} */(mockJwtToken), '', '');

			await expect(jwtTokenManager.createRefreshToken(payload)).rejects
				.toThrowError('REFRESH_TOKEN_KEY must be set');
		});

		it('should create refreshToken correctly', async () => {
			const payload = {
				username: 'dicoding',
			};
			const mockJwtToken = {
				generate: jest.fn().mockImplementation(() => 'mock_token'),
			};
			const accessTokenKey = 'access_token_key';
			const refreshTokenKey = 'refresh_token_key';
			const jwtTokenManager = new JwtTokenManager(/** @type {any} */(mockJwtToken), accessTokenKey, refreshTokenKey);

			const refreshToken = await jwtTokenManager.createRefreshToken(payload);

			expect(mockJwtToken.generate).toBeCalledWith(payload, refreshTokenKey);
			expect(refreshToken).toEqual('mock_token');
		});
	});

	describe('verifyRefreshToken method', () => {
		it('should throw an error when refresh token key is not set', async () => {
			const jwtTokenManager = new JwtTokenManager(hapiJwt.token, 'access_token_key', '');
			const accessToken = await jwtTokenManager.createAccessToken({username: 'dicoding'});

			await expect(jwtTokenManager.verifyRefreshToken(accessToken)).rejects
				.toThrowError('REFRESH_TOKEN_KEY must be set');
		});

		it('should throw InvariantError when verification has failed', async () => {
			const jwtTokenManager = new JwtTokenManager(hapiJwt.token, 'access_token_key', 'refresh_token_key');
			const accessToken = await jwtTokenManager.createAccessToken({username: 'dicoding'});

			await expect(jwtTokenManager.verifyRefreshToken(accessToken)).rejects
				.toThrowError(InvariantError);
		});

		it('shouldn\'t throw InvariantError when verification has succeed', async () => {
			const jwtTokenManager = new JwtTokenManager(hapiJwt.token, 'access_token_key', 'refresh_token_key');
			const refreshToken = await jwtTokenManager.createRefreshToken({username: 'dicoding'});

			await expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not
				.toThrowError(InvariantError);
		});
	});

	describe('decodePayload method', () => {
		it('should decode payload correctly', async () => {
			const jwtTokenManager = new JwtTokenManager(hapiJwt.token, 'access_token_key', 'refresh_token_key');
			const accessToken = await jwtTokenManager.createAccessToken({username: 'dicoding'});

			const {username: expectedUsername} = await jwtTokenManager.decodePayload(accessToken);

			expect(expectedUsername).toEqual('dicoding');
		});
	});
});
