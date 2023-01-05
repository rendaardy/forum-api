/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = pgm => {
  pgm.addConstraint(
    "comments",
    "comments.reply_to.fkey",
    "FOREIGN KEY(reply_to) REFERENCES threads(id) ON DELETE CASCADE",
  );
  pgm.addConstraint(
    "comments",
    "comments.comment_id.fkey",
    "FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE",
  );
};

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = pgm => {
  pgm.dropConstraint("comments", "comments.reply_to.fkey");
  pgm.dropConstraint("comments", "comments.comment_id.fkey");
};
