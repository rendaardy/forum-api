import {InvariantError} from './invariant-error.js';

export class DomainErrorTranslator {
	static #directories = new Map([
		['REGISTER_USER.NOT_MEET_REQUIRED_PROPERTIES', new InvariantError('Failed to create a new user. Missing the required properties')],
		['REGISTER_USER.TYPE_MISMATCH', new InvariantError('Failed to create a new user. Type mismatch')],
		['REGISTER_USER.USERNAME_LIMIT_CHAR', new InvariantError('Failed to create a new user. Username reaches more than 50 characters')],
		['REGISTER_USER.USERNAME_CONTAIN_FORBIDDEN_CHARACTERS', new InvariantError('Failed to create a new user. Username contains forbidden characters')],
		['USER_LOGIN.NOT_MEET_REQUIRED_PROPERTIES', new InvariantError('username or password is required')],
		['USER_LOGIN.TYPE_MISMATCH', new InvariantError('username or password must be of type string')],
		['USER_LOGOUT_USECASE.NOT_CONTAIN_REFRESH_TOKEN', new InvariantError('refresh token is required')],
		['USER_LOGOUT_USECASE.TYPE_MISMATCH', new InvariantError('invalid refresh token')],
		['REFRESH_AUTHENTICATION_USECASE.NOT_CONTAIN_REFRESH_TOKEN', new InvariantError('refresh token is required')],
		['REFRESH_AUTHENTICATION_USECASE.TYPE_MISMATCH', new InvariantError('refresh token must be of type string')],
		['DELETE_AUTHENTICATION_USECASE.NOT_CONTAIN_REFRESH_TOKEN', new InvariantError('refresh token is required')],
		['DELETE_AUTHENTICATION_USECASE.TYPE_MISMATCH', new InvariantError('refresh token must be of type string')],
		['CREATE_THREAD.NOT_MEET_REQUIRED_PROPERTIES', new InvariantError('Failed to create a new thread. Missing the required properties')],
		['CREATE_THREAD.TYPE_MISMATCH', new InvariantError('Failed to create a new thread. Type mismatch')],
		['CREATE_COMMENT.NOT_MEET_REQUIRED_PROPERTIES', new InvariantError('Failed to create a new comment. Missing the required properties')],
		['CREATE_COMMENT.TYPE_MISMATCH', new InvariantError('Failed to create a new comment. Type mismatch')],
		['DETAILED_THREAD.NOT_MEET_REQUIRED_PROPERTIES', new InvariantError('Failed to get detailed thread. Missing the required properties')],
		['DETAILED_THREAD.TYPE_MISMATCH', new InvariantError('Failed to get detailed thread. Type mismatch')],
		['DETAILED_COMMENT.NOT_MEET_REQUIRED_PROPERTIES', new InvariantError('Failed to get detailed comment. Missing the required properties')],
		['DETAILED_COMMENT.TYPE_MISMATCH', new InvariantError('Failed to get detailed comment. Type mismatch')],
	]);

	/**
   * @param {Error} error
   */
	static translate(error) {
		return DomainErrorTranslator.#directories.get(error.message) ?? error;
	}
}
