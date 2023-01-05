/* eslint-disable camelcase */

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = pgm => {
  pgm.addColumn("comments", {
    comment_id: {
      type: "VARCHAR(50)",
      notNull: false,
    },
  });
};

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = pgm => {
  pgm.dropColumn("comments", "comment_id");
};
