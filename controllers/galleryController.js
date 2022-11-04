const Gallery = require('../models/galleryModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

exports.uploadPhoto = catchAsync(async (req, res, next) => {
  req.body.photo = req.file.filename;
  const gallery = await Gallery.create(req.body.photo);

  res.status(201).json({
    status: 'Success',
    Message: 'Photo Uploaded',
    data: gallery,
  });
});

exports.getgallery = factory.getAll(Gallery);
