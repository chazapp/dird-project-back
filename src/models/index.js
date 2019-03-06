const mongoose = require('mongoose');
const userSchema = require('./users');

mongoose.connect(process.env.MONGO_URL, (error) => {
  if (error) {
    console.log('Could not connect MongoDB: ', error);
  } else {
    console.log('MongoDB connected.');
  }
});

mongoose.model('users', userSchema);

module.exports = mongoose;
