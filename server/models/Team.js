const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const UserSchema = require('./User');

const Team = new Schema({
  name: String,
  users: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Team', Team);