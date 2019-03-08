const mongoose = require('mongoose');

const woofSchema = mongoose.Schema({
  handle: String,
  text: String,
});

module.exports = woofSchema;
