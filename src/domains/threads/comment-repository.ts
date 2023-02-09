import type {CreateComment} from './entities/create-comment.ts';
import type {CreatedComment} from './entities/created-comment.ts';
import type {DetailedComment} from './entities/detailed-comment.ts';

export class CommentRepository {
	async addComment(
		_userId: string,
		_threadId: string,
		_createComment: CreateComment,
	): Promise<CreatedComment> {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async removeComment(_commentId: string): Promise<void> {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async likeComment(_userId: string, _commentId: string): Promise<void> {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async unlikeComment(_userId: string, _comment: string): Promise<void> {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async hasBeenLiked(_userId: string, _comment: string): Promise<boolean> {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async getAllTotalCommentLikes(): Promise<Array<[string, number]>> {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async verifyCommentOwner(_userId: string, _commentId: string): Promise<void> {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async commentExists(_commentId: string): Promise<boolean> {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async getAllDetailedCommentsFromThread(_threadId: string): Promise<DetailedComment[]> {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}
