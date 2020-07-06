const RatingsService = {
  getAllRatings(db) {
    return db
      .from("ratings")
      .select("*")
  },
  getById(db, id) {
    return db
      .from("ratings")
      .select(
        "ratings.id",
        "ratings.scents_id",
        "ratings.rating",
        "ratings.users_id",
        "ratings.date_created",
        "ratings.date_edited"
      )
      .where("id", id)
      .then((rows) => {
        return rows[0]
      })
  },
  insertRating(db, updatedRating) {
    return db
      .insert(updatedRating)
      .into("ratings")
      .returning("*")
      .then((rows) => {
        return rows[0]
      })
  },
  updateRating(db, id, updatedRating) {
    return db("ratings")
      .where({ id })
      .update(updatedRating);
  },
}

module.exports = RatingsService;