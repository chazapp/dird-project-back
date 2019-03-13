const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  handle: String,
  timestamp: { type: Date, default: Date.now },
  txt: String,
});

const conversationSchema = mongoose.Schema({
  handles: [String],
  messages: [messageSchema],
});

module.exports.Conversation = conversationSchema;
module.exports.Message = messageSchema;
