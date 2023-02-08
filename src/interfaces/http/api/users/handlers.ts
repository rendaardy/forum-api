import type {Request, ResponseToolkit, Lifecycle} from '@hapi/hapi';

export async function postUsersHandler(
	request: Request,
	h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
	const {addUser} = request.server.methods;
	const addedUser = await addUser(request.payload as Record<string, unknown>);

	return h.response({
		status: 'success',
		data: {
			addedUser,
		},
	}).code(201);
}
