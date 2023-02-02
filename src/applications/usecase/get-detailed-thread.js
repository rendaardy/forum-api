export class GetDetailedThread {
	#threadRepository;
	#commentRepository;
	#replyRepository;

	/**
     * @param {import("#domains/threads/thread-repository.js").ThreadRepository} threadRepository
     * @param {import("#domains/threads/comment-repository.js").CommentRepository} commentRepository
     * @param {import("#domains/threads/reply-repository.js").ReplyRepository} replyRepository
     */
	constructor(threadRepository, commentRepository, replyRepository) {
		this.#threadRepository = threadRepository;
		this.#commentRepository = commentRepository;
		this.#replyRepository = replyRepository;
	}

	/**
     * @param {string} threadId
     * @returns {Promise<import("#domains/threads/entities/detailed-thread.js").DetailedThread>}
     */
	async execute(threadId) {
		const detailedThread = await this.#threadRepository.getDetailedThread(threadId);
		const detailedComments = await this.#commentRepository.getAllDetailedCommentsFromThread(threadId);
		const getReplies = await Promise.all(
			detailedComments.map(it => this.#replyRepository.getAllDetailedRepliesFromComment(it.id)),
		);

		for (const [i, comment] of Object.entries(detailedComments)) {
			const [replyOwner, replies] = getReplies[Number(i)];

			if (comment.id === replyOwner) {
				comment.replies = replies;
			}
		}

		detailedThread.comments = detailedComments;

		return detailedThread;
	}
}
