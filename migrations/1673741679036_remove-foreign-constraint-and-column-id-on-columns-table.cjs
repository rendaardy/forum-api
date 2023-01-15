/* eslint-disable camelcase */

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = pgm => {
	pgm.dropConstraint('comments', 'comments.comment_id.fkey');
	pgm.dropColumn('comments', 'comment_id');
};

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = pgm => {
	pgm.addColumn('comments', {
		comment_id: {
			type: 'VARCHAR(50)',
			notNull: false,
		},
	});
	pgm.addConstraint(
		'comments',
		'comments.comment_id.fkey',
		'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
	);
};
