/* eslint-disable @typescript-eslint/consistent-type-definitions */

import joi from 'joi';

import {AddThread} from '#applications/usecase/add-thread.ts';
import {AddComment} from '#applications/usecase/add-comment.ts';
import {RemoveComment} from '#applications/usecase/remove-comment.ts';
import {GetDetailedThread} from '#applications/usecase/get-detailed-thread.ts';
import {AddReply} from '#applications/usecase/add-reply.ts';
import {RemoveReply} from '#applications/usecase/remove-reply.ts';
import {ToggleLikeComment} from '#applications/usecase/toggle-like-comment.ts';
import {
	postThreadHandler,
	postCommentHandler,
	deleteCommentHandler,
	getDetailedThreadHandler,
	postReplyHandler,
	deleteReplyHandler,
	putLikeCommentHandler,
} from './handlers.ts';
import {responseSchema} from './schema.ts';

import type {Container} from 'inversify';
import type {Plugin} from '@hapi/hapi';

type ThreadsPluginOpts = {
	container: Container;
};

export const threadsPlugin: Plugin<ThreadsPluginOpts> = {
	name: 'app/threads',
	async register(server, opts) {
		const {container} = opts;
		const addThread = container.get(AddThread);
		const addComment = container.get(AddComment);
		const removeComment = container.get(RemoveComment);
		const getDetaildThread = container.get(GetDetailedThread);
		const addReply = container.get(AddReply);
		const removeReply = container.get(RemoveReply);
		const toggleLikeComment = container.get(ToggleLikeComment);

		server.method('addThread', addThread.execute, {bind: addThread});
		server.method('addComment', addComment.execute, {bind: addComment});
		server.method('removeComment', removeComment.execute, {bind: removeComment});
		server.method('getDetailedThread', getDetaildThread.execute, {bind: getDetaildThread});
		server.method('addReply', addReply.execute, {bind: addReply});
		server.method('removeReply', removeReply.execute, {bind: removeReply});
		server.method('toggleLikeComment', toggleLikeComment.execute, {bind: toggleLikeComment});

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
			{
				path: '/threads/{threadId}/comments/{commentId}/replies',
				method: 'POST',
				handler: postReplyHandler,
				options: {
					auth: 'forum-api_jwt',
					validate: {
						query: joi.object({
							threadId: joi.string(),
							commentId: joi.string(),
						}),
					},
					response: {
						schema: responseSchema.tailor('postReply'),
					},
				},
			},
			{
				path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
				method: 'DELETE',
				handler: deleteReplyHandler,
				options: {
					auth: 'forum-api_jwt',
					validate: {
						query: joi.object({
							threadId: joi.string(),
							commentId: joi.string(),
							replyId: joi.string(),
						}),
					},
					response: {
						schema: responseSchema,
					},
				},
			},
			{
				path: '/threads/{threadId}/comments/{commentId}/likes',
				method: 'PUT',
				handler: putLikeCommentHandler,
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

declare module '@hapi/hapi' {
	interface ServerMethods {
		addThread: typeof AddThread.prototype.execute;
		addComment: typeof AddComment.prototype.execute;
		addReply: typeof AddReply.prototype.execute;
		removeComment: typeof RemoveComment.prototype.execute;
		removeReply: typeof RemoveReply.prototype.execute;
		getDetailedThread: typeof GetDetailedThread.prototype.execute;
		toggleLikeComment: typeof ToggleLikeComment.prototype.execute;
	}
}
