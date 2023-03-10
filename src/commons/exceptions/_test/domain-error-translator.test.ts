import {describe, it, expect} from '@jest/globals';

import {InvariantError} from '../invariant-error.ts';
import {DomainErrorTranslator} from '../domain-error-translator.ts';

describe('DomainErrorTranslator', () => {
	it('should translate error correctly', () => {
		expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_REQUIRED_PROPERTIES')))
			.toStrictEqual(new InvariantError('Failed to create a new user. Missing the required properties'));
		expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.TYPE_MISMATCH')))
			.toStrictEqual(new InvariantError('Failed to create a new user. Type mismatch'));
		expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
			.toStrictEqual(new InvariantError('Failed to create a new user. Username reaches more than 50 characters'));
		expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_FORBIDDEN_CHARACTERS')))
			.toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
		expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_MEET_REQUIRED_PROPERTIES')))
			.toStrictEqual(new InvariantError('username or password is required'));
		expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.TYPE_MISMATCH')))
			.toStrictEqual(new InvariantError('username or password must be of type string'));
		expect(DomainErrorTranslator.translate(new Error('USER_LOGOUT_USECASE.NOT_CONTAIN_REFRESH_TOKEN')))
			.toStrictEqual(new InvariantError('refresh token is required'));
		expect(DomainErrorTranslator.translate(new Error('USER_LOGOUT_USECASE.TYPE_MISMATCH')))
			.toStrictEqual(new InvariantError('invalid refresh token'));
		expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USECASE.NOT_CONTAIN_REFRESH_TOKEN')))
			.toStrictEqual(new InvariantError('refresh token is required'));
		expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USECASE.TYPE_MISMATCH')))
			.toStrictEqual(new InvariantError('refresh token must be of type string'));
		expect(DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USECASE.NOT_CONTAIN_REFRESH_TOKEN')))
			.toStrictEqual(new InvariantError('refresh token is required'));
		expect(DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USECASE.TYPE_MISMATCH')))
			.toStrictEqual(new InvariantError('refresh token must be of type string'));
	});

	it('should return original error when error message isn\'t translated', () => {
		const error = new Error('some_error_message');

		const translatedError = DomainErrorTranslator.translate(error);

		expect(translatedError).toStrictEqual(error);
	});
});
