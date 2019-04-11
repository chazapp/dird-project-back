const mongoose = require('mongoose');

const woofSchema = mongoose.Schema({
  handle: String,
  text: String,
  hashtags: [{
    type: String,
  }],
});

module.exports = woofSchema;
