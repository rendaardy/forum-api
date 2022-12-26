/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = pgm => {
  pgm.addConstraint(
    "comments", 
    "comments.user_id.fkey", 
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE",
  );
  pgm.addConstraint(
    "comments", 
    "comments.reply_to_thread.fkey", 
    "FOREIGN KEY(reply_to) REFERENCES threads(id) ON DELETE CASCADE",
  );
  pgm.addConstraint(
    "comments", 
    "comments.reply_to_comment.fkey", 
    "FOREIGN KEY(reply_to) REFERENCES comments(id) ON DELETE CASCADE",
  );
};

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = pgm => {
  pgm.dropConstraint("comments", "comments.user_id.fkey");
  pgm.dropConstraint("comments", "comments.reply_to_thread.fkey");
  pgm.dropConstraint("comments", "comments.reply_to_comment.fkey");
};
