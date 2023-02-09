import type {Request, ResponseToolkit, Lifecycle} from '@hapi/hapi';

export async function postAuthentications(
	request: Request,
	h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
	const {loginUser} = request.server.methods;
	const {accessToken, refreshToken} = await loginUser(request.payload as Record<string, unknown>);

	return h.response({
		status: 'success',
		data: {
			accessToken,
			refreshToken,
		},
	}).code(201);
}

export async function putAuthentications(
	request: Request,
	_h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
	const {refreshAuth} = request.server.methods;
	const accessToken = await refreshAuth(request.payload as Record<string, unknown>);

	return {
		status: 'success',
		data: {
			accessToken,
		},
	};
}

export async function deleteAuthentications(
	request: Request,
	_h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
	const {logoutUser} = request.server.methods;

	await logoutUser(request.payload as Record<string, unknown>);

	return {
		status: 'success',
	};
}
