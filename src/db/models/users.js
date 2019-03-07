const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  handle: String,
  hashedPassword: String,
  accessTokens: [{
    type: String,
  }],
  picture: { data: Buffer, contentType: String },
});

module.exports = userSchema;
