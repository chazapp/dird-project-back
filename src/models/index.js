const mongoose = require('mongoose');
const userSchema = require('./users');

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
module.exports = mongoose;
module.exports.User = User;
