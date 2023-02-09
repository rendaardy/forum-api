import type {CreateReply} from './entities/create-reply.ts';
import type {CreatedReply} from './entities/created-reply.ts';
import type {DetailedReply} from './entities/detailed-reply.ts';

export class ReplyRepository {
	async addReply(
		_userId: string,
		_commentId: string,
		_createReply: CreateReply,
	): Promise<CreatedReply> {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async removeReply(_replyId: string): Promise<void> {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async verifyReplyOwner(_userId: string, _replyId: string): Promise<void> {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async replyExists(_replyId: string): Promise<boolean> {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async getAllDetailedRepliesFromComment(_commentId: string): Promise<[string, DetailedReply[]]> {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}
