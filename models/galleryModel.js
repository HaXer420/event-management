const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
