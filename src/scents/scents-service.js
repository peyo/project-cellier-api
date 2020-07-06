const ScentsService = {
  getAllScents(db) {
    return db
      .from("scents")
      .select(
        "scents.id",
        "scents.scent_name",
        "scents.groups_id",
        "scents.note",
        "scents.distributor",
        "scents.manufacturer",
        "scents.type",
        "scents.origin_country",
        "scents.extra_origin_information",
        "scents.odor_description",
        "scents.link"
      )
      .leftJoin("groups", "scents.groups_id", "groups.id");
  },
  getById(db, id) {
    return db
      .from("scents")
      .select(
        "scents.id",
        "scents.scent_name",
        "scents.groups_id",
        "scents.note",
        "scents.distributor",
        "scents.manufacturer",
        "scents.type",
        "scents.origin_country",
        "scents.extra_origin_information",
        "scents.odor_description",
        "scents.link"
      )
      .where("id", id)
      .first();
  },
  getRatings(db, id) {
    return db
      .from("ratings")
      .select(
        db.raw(`
          ratings.scents_id,
          ROUND(AVG(ratings.rating), 1) AS scent_avg
        `)
      )
      .where("scents_id", id)
      .leftJoin("scents", "ratings.scents_id", "scents.id")
      .groupBy("ratings.scents_id")
      .then((ratings) => {
        return ratings[0];
      });
  },
  serializeScent(scent) {
    return {
      id: scent.id,
      scent_name: scent.scent_name,
      groups_id: scent.groups_id,
      note: scent.note,
      distributor: scent.distributor,
      manufacturer: scent.manufacturer,
      type: scent.type,
      origin_country: scent.origin_country,
      extra_origin_information: scent.extra_origin_information,
      odor_description: scent.odor_description,
      link: scent.link,
    };
  },
  serializeRating(rating) {
    return {
      id: rating.id,
      scents_id: rating.scents_id,
      rating: rating.rating,
      users_id: rating.users_id,
      date_created: new Date(rating.date_created),
      date_edited: new Date(rating.date_edited),
    };
  },
};

module.exports = ScentsService;
