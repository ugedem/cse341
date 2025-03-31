const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  githubId: { type: String, unique: true, sparse: true },  // Add this line
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String }, // Keep password only for local users
});

module.exports = mongoose.model("User", userSchema);
