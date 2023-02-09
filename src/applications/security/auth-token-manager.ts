export class AuthTokenManager {
	async createAccessToken(_payload: any): Promise<string> {
		throw new Error('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	}

	async createRefreshToken(_payload: any): Promise<string> {
		throw new Error('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	}

	async verifyRefreshToken(_token: string): Promise<void> {
		throw new Error('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	}

	async decodePayload(_accessToken: string): Promise<any> {
		throw new Error('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	}
}
