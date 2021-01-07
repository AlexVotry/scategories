const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const TeamSchema = require('./Team');

const Group = new Schema({
  name: String,
  teams: { type: Schema.Types.ObjectId, ref: 'Team' },
});

module.exports = mongoose.model('Group', Group);