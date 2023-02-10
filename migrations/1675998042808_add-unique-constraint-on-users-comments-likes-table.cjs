/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = pgm => {
	pgm.addConstraint(
		'users_comments_likes',
		'users_comments_likes.unique',
		{
			unique: ['user_id', 'comment_id'],
		},
	);
};

/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = pgm => {
	pgm.dropConstraint('users_comments_likes', 'users_comments_likes.unique');
};
