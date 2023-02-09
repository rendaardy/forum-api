import type {ThreadRepository} from '#domains/threads/thread-repository.ts';
import type {CommentRepository} from '#domains/threads/comment-repository.ts';
import type {ReplyRepository} from '#domains/threads/reply-repository.ts';
import type {DetailedThread} from '#domains/threads/entities/detailed-thread.ts';

export class GetDetailedThread {
	#threadRepository: ThreadRepository;
	#commentRepository: CommentRepository;
	#replyRepository: ReplyRepository;

	constructor(
		threadRepository: ThreadRepository,
		commentRepository: CommentRepository,
		replyRepository: ReplyRepository,
	) {
		this.#threadRepository = threadRepository;
		this.#commentRepository = commentRepository;
		this.#replyRepository = replyRepository;
	}

	async execute(threadId: string): Promise<DetailedThread> {
		const detailedThread = await this.#threadRepository.getDetailedThread(threadId);
		const detailedComments = await this.#commentRepository.getAllDetailedCommentsFromThread(threadId);
		const getReplies = await Promise.all(
			detailedComments.map(async it => this.#replyRepository.getAllDetailedRepliesFromComment(it.id)),
		);
		const getTotalCommentLikes = await this.#commentRepository.getAllTotalCommentLikes();

		for (const [i, comment] of Object.entries(detailedComments)) {
			if (getReplies.length > 0) {
				const [replyOwner, replies] = getReplies[Number(i)];

				if (comment.id === replyOwner) {
					comment.replies = replies;
				}
			}

			if (getTotalCommentLikes.length > 0) {
				const [commentOwner, totalLikes] = getTotalCommentLikes[Number(i)];

				if (comment.id === commentOwner) {
					comment.likeCount = totalLikes;
				}
			}
		}

		detailedThread.comments = detailedComments;

		return detailedThread;
	}
}
