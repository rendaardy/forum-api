/* eslint-disable camelcase */

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = pgm => {
	pgm.createTable('comments', {
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
};

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = pgm => {
	pgm.dropTable('comments');
};
