/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = pgm => {
	pgm.createTable('users_comments_likes', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		user_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		comment_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
	});
	pgm.addConstraint(
		'users_comments_likes',
		'users_comments_likes.user_id.fkey',
		'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
	);
	pgm.addConstraint(
		'users_comments_likes',
		'users_comments_likes.comment_id.fkey',
		'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
	);
};

/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = pgm => {
	pgm.dropTable('users_comments_likes');
};
