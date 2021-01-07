const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  email: String,
  admin: Boolean,
  wins: {type: Number, default: 0 },
  losses: {type: Number, default: 0 }
});

module.exports = mongoose.model('User', User);