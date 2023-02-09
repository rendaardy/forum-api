import type {Request, ResponseToolkit, Lifecycle} from '@hapi/hapi';

type AuthCredentials = {
	id: string;
	username: string;
};

export async function postThreadHandler(
	request: Request,
	h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
	const {id: userId} = request.auth.credentials as AuthCredentials;
	const {addThread} = request.server.methods;

	const createdThread = await addThread(userId, request.payload as Record<string, unknown>);

	return h.response({
		status: 'success',
		data: {
			addedThread: createdThread,
		},
	}).code(201);
}

export async function postCommentHandler(
	request: Request,
	h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
	const {threadId} = request.params;
	const {id: userId} = request.auth.credentials as AuthCredentials;
	const {addComment} = request.server.methods;

	const createdComment = await addComment(userId, threadId, request.payload as Record<string, unknown>);

	return h.response({
		status: 'success',
		data: {
			addedComment: createdComment,
		},
	}).code(201);
}

export async function putLikeCommentHandler(
	request: Request,
	_h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
	const {threadId, commentId} = request.params;
	const {id: userId} = request.auth.credentials as AuthCredentials;
	const {toggleLikeComment} = request.server.methods;

	await toggleLikeComment(userId, threadId, commentId);

	return {status: 'success'};
}

export async function deleteCommentHandler(
	request: Request,
	_h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
	const {threadId, commentId} = request.params;
	const {id: userId} = request.auth.credentials as AuthCredentials;
	const {removeComment} = request.server.methods;

	await removeComment(userId, threadId, commentId);

	return {status: 'success'};
}

export async function postReplyHandler(
	request: Request,
	h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
	const {threadId, commentId} = request.params;
	const {id: userId} = request.auth.credentials as AuthCredentials;
	const {addReply} = request.server.methods;

	const createdComment = await addReply(userId, threadId, commentId, request.payload as Record<string, unknown>);

	return h.response({
		status: 'success',
		data: {
			addedReply: createdComment,
		},
	}).code(201);
}

export async function deleteReplyHandler(
	request: Request,
	_h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
	const {threadId, commentId, replyId} = request.params;
	const {id: userId} = request.auth.credentials as AuthCredentials;
	const {removeReply} = request.server.methods;

	await removeReply(userId, threadId, commentId, replyId);

	return {status: 'success'};
}

export async function getDetailedThreadHandler(
	request: Request,
	_h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
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
