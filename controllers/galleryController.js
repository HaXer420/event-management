const Gallery = require('../models/galleryModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

exports.uploadPhoto = catchAsync(async (req, res, next) => {
  if (!req.file.filename) {
    return next(new AppError('Image not found please upload again', 404));
  }
  req.body.photo = req.file.filename;
  const gallery = await Gallery.create(req.body);

  res.status(201).json({
    status: 'Success',
    Message: 'Photo Uploaded',
    data: gallery,
  });
});

exports.getgallery = factory.getAll(Gallery);
