const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  handle: String,
  hashedPassword: String,
  accessTokens: [{
    type: String,
  }],
  pictureB64: String,
  woofs: [{
    type: String,
  }],
});

module.exports = userSchema;
