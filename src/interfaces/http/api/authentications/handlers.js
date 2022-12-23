/**
 * @param {import("@hapi/hapi").Request} request
 * @param {import("@hapi/hapi").ResponseToolkit} h
 * @returns {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
 */
export async function postAuthentications(request, h) {
	const {loginUser} = request.server.methods;
	const {accessToken, refreshToken} = await loginUser(request.payload);

	return h.response({
		status: 'success',
		data: {
			accessToken,
			refreshToken,
		},
	}).code(201);
}

/**
 * @param {import("@hapi/hapi").Request} request
 * @param {import("@hapi/hapi").ResponseToolkit} _h
 * @returns {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
 */
export async function putAuthentications(request, _h) {
	const {refreshAuth} = request.server.methods;
	const accessToken = await refreshAuth(request.payload);

	return {
		status: 'success',
		data: {
			accessToken,
		},
	};
}

/**
 * @param {import("@hapi/hapi").Request} request
 * @param {import("@hapi/hapi").ResponseToolkit} _h
 * @returns {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
 */
export async function deleteAuthentications(request, _h) {
	const {logoutUser} = request.server.methods;

	await logoutUser(request.payload);

	return {
		status: 'success',
	};
}
