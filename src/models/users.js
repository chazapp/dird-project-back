const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  hashedPassword: String,
  accessTokens: [{
    type: String,
  }],
});

module.exports = userSchema;
