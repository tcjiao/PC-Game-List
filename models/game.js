const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    name: { type: String, required: true },
    id: Number,
  }, {
    timestamps: true
  });

  module.exports = mongoose.model('Game', gameSchema);