/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = pgm => {
	pgm.addConstraint('threads', 'threads.user_id.fkey', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = pgm => {
	pgm.dropConstraint('threads', 'threads.user_id.fkey');
};
