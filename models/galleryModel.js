const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
  foldername: {
    type: String,
    unique: [true, 'Name must be unique'],
  },
  photo: [
    {
      link: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
