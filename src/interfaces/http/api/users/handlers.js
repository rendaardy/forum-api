/**
 * @param {import("@hapi/hapi").Request} request
 * @param {import("@hapi/hapi").ResponseToolkit} h
 * @returns {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
 */
export async function postUsersHandler(request, h) {
	const {addUser} = request.server.methods;
	const addedUser = await addUser(/** @type {any} */(request.payload));

	return h.response({
		status: 'success',
		data: {
			addedUser,
		},
	}).code(201);
}
