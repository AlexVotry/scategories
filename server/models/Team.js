const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const UserSchema = require('./User');
// users: { type: Schema.Types.ObjectId, ref: 'User' },

const Team = new Schema({
  name: String,
  answers: [{
    type: Map,
    of: String
  }],
  finalAnswers: {type: Map, of: String}
});

module.exports = mongoose.model('Team', Team);