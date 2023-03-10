import {describe, it, expect} from '@jest/globals';

import {CreateReply} from '#domains/threads/entities/create-reply.ts';
import {ReplyRepository} from '../reply-repository.ts';

describe('ReplyRepository interface', () => {
	it('should throw an error when user try to invoke an unimplemented method', async () => {
		const replyRepository = new ReplyRepository();
		const createReply = new CreateReply({content: ' a comment reply '});

		await expect(async () => replyRepository.addReply('user-abc123', 'comment-abc123', createReply))
			.rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(async () => replyRepository.removeReply('reply-abc123'))
			.rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(async () => replyRepository.verifyReplyOwner('user-abc123', 'reply-abc123'))
			.rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(async () => replyRepository.replyExists('reply-abc123'))
			.rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(async () => replyRepository.getAllDetailedRepliesFromComment('comment-abc123'))
			.rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	});
});
