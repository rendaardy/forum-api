import {describe, it, expect} from '@jest/globals';

import {CreateComment} from '#domains/threads/entities/create-comment.ts';
import {CommentRepository} from '../comment-repository.ts';

describe('CommentRepository interface', () => {
	it('should throw an error when user try to invoke an unimplemented method', async () => {
		const commentRepository = new CommentRepository();
		const createComment = new CreateComment({content: 'a comment'});

		await expect(async () => commentRepository.addComment('user-abc123', 'thread-abc123', createComment))
			.rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(async () => commentRepository.removeComment('thread-abc123'))
			.rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(async () => commentRepository.verifyCommentOwner('user-abc123', 'comment-abc123'))
			.rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(async () => commentRepository.commentExists('comment-abc123'))
			.rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(async () => commentRepository.getAllDetailedCommentsFromThread('thread-abc123'))
			.rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});
