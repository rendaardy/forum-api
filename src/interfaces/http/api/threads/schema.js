import joi from 'joi';

export const addThreadPaylodSchema = joi.object({
	title: joi.string().required(),
	body: joi.string().required(),
});
export const addCommentPayloadSchema = joi.object({
	content: joi.string().required(),
});
export const responseSchema = joi.object({
	status: joi.string().valid('success', 'fail').required(),
	message: joi.string().optional(),
	data: joi.object().alter({
		postThread: schema => schema.append({
			addedThread: joi.object({
				id: joi.string().required(),
				title: joi.string().required(),
				owner: joi.string().required(),
			}),
		}),
		postComment: schema => schema.append({
			addedComment: joi.object({
				id: joi.string().required(),
				content: joi.string().required(),
				owner: joi.string().required(),
			}),
		}),
		getDetailedThread: schema => schema.append({
			thread: joi.object({
				id: joi.string().required(),
				title: joi.string().required(),
				body: joi.string().required(),
				date: joi.date().required(),
				username: joi.string().required(),
				comments: joi.array().items(joi.object({
					id: joi.string().required(),
					username: joi.string().required(),
					date: joi.date().required(),
					content: joi.string().required(),
				})),
			}),
		}),
	}).optional(),
});
