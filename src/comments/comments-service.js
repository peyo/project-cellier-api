const xss = require("xss");

const CommentsService = {
  getAllComments(db) {
    return db
      .from("comments")
      .select("*");
  },
  getById(db, id) {
    return db
      .from("comments")
      .select(
        "comments.id",
        "comments.scents_id",
        "comments.comment",
        "comments.users_id",
        "comments.date_created",
        "comments.date_edited"
      )
      .where("id", id)
      .then((rows) => {
        return rows[0];
      });
  },
  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into("comments")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteComment(db, id) {
    return db("comments")
      .where({ id })
      .delete();
  },
  updateComment(db, id, newComment) {
    return db("comments")
      .where({ id })
      .update(newComment);
  },
  serializeComment(comment) {
    return {
      id: comment.id,
      scents_id: comment.scents_id,
      comment: xss(comment.comment),
      users_id: comment.users_id,
      date_created: comment.date_created,
      date_edited: comment.date_edited,
    };
  },
};

module.exports = CommentsService;
