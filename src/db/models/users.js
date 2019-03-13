const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  handle: String,
  hashedPassword: String,
  accessTokens: [{
    type: String,
  }],
  picture: { data: Buffer, contentType: String },
  woofs: [{
    type: String,
  }],
});

module.exports = mongoose.model('User', userSchema);
