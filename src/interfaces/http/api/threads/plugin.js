import joi from 'joi';

import {AddThread} from '#applications/usecase/add-thread.js';
import {AddComment} from '#applications/usecase/add-comment.js';
import {RemoveComment} from '#applications/usecase/remove-comment.js';
import {GetDetailedThread} from '#applications/usecase/get-detailed-thread.js';
import {
	postThreadHandler,
	postCommentHandler,
	deleteCommentHandler,
	getDetailedThreadHandler,
} from './handlers.js';
import {responseSchema} from './schema.js';

/**
 * @typedef {object} ThreadsPluginOpts
 * @property {import("inversify").Container} container
 */

/** @type {import("@hapi/hapi").Plugin<ThreadsPluginOpts>} */
export const threadsPlugin = {
	name: 'app/threads',
	async register(server, opts) {
		const {container} = opts;
		const addThread = container.get(AddThread);
		const addComment = container.get(AddComment);
		const removeComment = container.get(RemoveComment);
		const getDetaildThread = container.get(GetDetailedThread);

		server.method('addThread', addThread.execute, {bind: addThread});
		server.method('addComment', addComment.execute, {bind: addComment});
		server.method('removeComment', removeComment.execute, {bind: removeComment});
		server.method('getDetailedThread', getDetaildThread.execute, {bind: getDetaildThread});

		server.route([
			{
				path: '/threads/{threadId}',
				method: 'GET',
				handler: getDetailedThreadHandler,
				options: {
					validate: {
						query: joi.object({
							threadId: joi.string(),
						}),
					},
					response: {
						schema: responseSchema.tailor('getDetailedThread'),
					},
				},
			},
			{
				path: '/threads',
				method: 'POST',
				handler: postThreadHandler,
				options: {
					auth: 'forum-api_jwt',
					response: {
						schema: responseSchema.tailor('postThread'),
					},
				},
			},
			{
				path: '/threads/{threadId}/comments',
				method: 'POST',
				handler: postCommentHandler,
				options: {
					auth: 'forum-api_jwt',
					validate: {
						query: joi.object({
							threadId: joi.string(),
						}),
					},
					response: {
						schema: responseSchema.tailor('postComment'),
					},
				},
			},
			{
				path: '/threads/{threadId}/comments/{commentId}',
				method: 'DELETE',
				handler: deleteCommentHandler,
				options: {
					auth: 'forum-api_jwt',
					validate: {
						query: joi.object({
							threadId: joi.string(),
							commentId: joi.string(),
						}),
					},
					response: {
						schema: responseSchema,
					},
				},
			},
		]);
	},
};
