const mongoose = require('mongoose');
const userSchema = require('./models/users');
const woofSchema = require('./models/woof');
const chat = require('./models/chat');

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, (error) => {
    if (error) {
      console.log('Could not connect MongoDB: ', error);
    } else {
      console.log('MongoDB connected.');
    }
  }).then();
}

const User = mongoose.model('users', userSchema);
const Woof = mongoose.model('woofs', woofSchema);
const Message = mongoose.model('messages', chat.Message);
const Conversation = mongoose.model('conversations', chat.Conversation);

module.exports = mongoose;
module.exports.User = User;
module.exports.Woof = Woof;
module.exports.Message = Message;
module.exports.Conversation = Conversation;
