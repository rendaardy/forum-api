/* eslint-disable camelcase */

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = pgm => {
	pgm.createTable('threads', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		title: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		body: {
			type: 'TEXT',
			notNull: true,
		},
		date: {
			type: 'TIMESTAMPTZ',
			notNull: true,
			default: pgm.func('CURRENT_TIMESTAMP'),
		},
		user_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
	});
};

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = pgm => {
	pgm.dropTable('threads');
};
