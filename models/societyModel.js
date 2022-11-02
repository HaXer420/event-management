const mongoose = require('mongoose');

const societySchema = mongoose.Schema({
  society: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Society = mongoose.model('Society', societySchema);

module.exports = Society;
