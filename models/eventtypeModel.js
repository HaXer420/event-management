const mongoose = require('mongoose');

const etypeSchema = mongoose.Schema({
  eventtype: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const EType = mongoose.model('EType', etypeSchema);

module.exports = EType;
