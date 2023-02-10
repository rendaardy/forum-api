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

		for (const comment of detailedComments) {
			for (const [replyOwner, replies] of getReplies) {
				if (comment.id === replyOwner) {
					comment.replies = replies;
				}
			}

			for (const [commentOwner, totalLikes] of getTotalCommentLikes) {
				if (comment.id === commentOwner) {
					comment.likeCount = totalLikes;
				}
			}
		}

		detailedThread.comments = detailedComments;

		return detailedThread;
	}
}
