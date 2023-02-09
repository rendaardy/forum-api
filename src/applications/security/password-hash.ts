export class PasswordHash {
	async hash(_password: string): Promise<string> {
		throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
	}

	async compare(_plain: string, _encrypted: string): Promise<void> {
		throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
	}
}
