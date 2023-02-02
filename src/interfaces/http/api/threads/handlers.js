/**
 * @param {import("@hapi/hapi").Request} request
 * @param {import("@hapi/hapi").ResponseToolkit} h
 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
 */
export async function postThreadHandler(request, h) {
	const {id: userId} = /** @type {{ id: string }} */(request.auth.credentials);
	const {addThread} = request.server.methods;

	const createdThread = await addThread(userId, request.payload);

	return h.response({
		status: 'success',
		data: {
			addedThread: createdThread,
		},
	}).code(201);
}

/**
 * @param {import("@hapi/hapi").Request} request
 * @param {import("@hapi/hapi").ResponseToolkit} h
 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
 */
export async function postCommentHandler(request, h) {
	const {threadId} = request.params;
	const {id: userId} = /** @type {{ id: string }} */(request.auth.credentials);
	const {addComment} = request.server.methods;

	const createdComment = await addComment(userId, threadId, request.payload);

	return h.response({
		status: 'success',
		data: {
			addedComment: createdComment,
		},
	}).code(201);
}

/**
 * @param {import("@hapi/hapi").Request} request
 * @param {import("@hapi/hapi").ResponseToolkit} _h
 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
 */
export async function deleteCommentHandler(request, _h) {
	const {threadId, commentId} = request.params;
	const {id: userId} = /** @type {{ id: string }} */(request.auth.credentials);
	const {removeComment} = request.server.methods;

	await removeComment(userId, threadId, commentId);

	return {status: 'success'};
}

/**
 * @param {import("@hapi/hapi").Request} request
 * @param {import("@hapi/hapi").ResponseToolkit} h
 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
 */
export async function postReplyHandler(request, h) {
	const {threadId, commentId} = request.params;
	const {id: userId} = /** @type {{ id: string }} */(request.auth.credentials);
	const {addReply} = request.server.methods;

	const createdComment = await addReply(userId, threadId, commentId, request.payload);

	return h.response({
		status: 'success',
		data: {
			addedReply: createdComment,
		},
	}).code(201);
}

/**
 * @param {import("@hapi/hapi").Request} request
 * @param {import("@hapi/hapi").ResponseToolkit} _h
 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
 */
export async function deleteReplyHandler(request, _h) {
	const {threadId, commentId, replyId} = request.params;
	const {id: userId} = /** @type {{ id: string }} */(request.auth.credentials);
	const {removeReply} = request.server.methods;

	await removeReply(userId, threadId, commentId, replyId);

	return {status: 'success'};
}

/**
 * @param {import("@hapi/hapi").Request} request
 * @param {import("@hapi/hapi").ResponseToolkit} _h
 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
 */
export async function getDetailedThreadHandler(request, _h) {
	const {threadId} = request.params;
	const {getDetailedThread} = request.server.methods;

	const detailedThread = await getDetailedThread(threadId);

	return {
		status: 'success',
		data: {
			thread: detailedThread,
		},
	};
}
