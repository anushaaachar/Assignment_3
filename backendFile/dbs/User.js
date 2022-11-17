let mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userEmail: { type: String, unique: true },
  password: { type: String, required: true },
  token: String,
});
const user = mongoose.model("user", userSchema);
module.exports = user;
