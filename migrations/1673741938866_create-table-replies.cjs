/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = pgm => {
	pgm.createTable('replies', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		user_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		reply_to: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		date: {
			type: 'TIMESTAMPTZ',
			notNull: true,
			default: pgm.func('CURRENT_TIMESTAMP'),
		},
		content: {
			type: 'TEXT',
			notNull: true,
		},
		is_deleted: {
			type: 'BOOLEAN',
			notNull: true,
			default: false,
		},
	});
	pgm.addConstraint(
		'replies',
		'replies.user_id.fkey',
		'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
	);
	pgm.addConstraint(
		'replies',
		'replies.reply_to.fkey',
		'FOREIGN KEY(reply_to) REFERENCES comments(id) ON DELETE CASCADE',
	);
};

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = pgm => {
	pgm.dropTable('replies');
};
