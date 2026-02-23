const db = require("../../config/db");

exports.findUserByUsername = async (username) => {
  return db("users")
    .where({ username })
    .first();
};

exports.createUser = async (data) => {
  const [user] = await db("users")
    .insert(data)
    .returning(["user_id", "username", "role"]);

  return user;
};