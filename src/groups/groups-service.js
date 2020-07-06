const GroupsService = {
  getAllGroups(db) {
    return db
      .from("groups")
      .select("*")
  },
  getById(db, id) {
    return db
      .from("groups")
      .select("*")
      .where("id", id)
      .first()
  },
  serializeGroup(group) {
    return {
      id: group.id,
      group_name: group.group_name,
      subgroup_name: group.subgroup_name,
      description: group.description,
      triangle_a: group.triangle_a,
      triangle_b: group.triangle_b,
      linear_a: group.linear_a,
      linear_b: group.linear_b 
    };
  },
};

module.exports = GroupsService;