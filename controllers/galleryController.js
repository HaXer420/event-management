const Gallery = require('../models/galleryModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

exports.createfolderuploadPhoto = catchAsync(async (req, res, next) => {
  if (!req.file.filename) {
    return next(new AppError('Image not found please upload again', 404));
  }

  const folder = {
    foldername: req.body.foldername,
    photo: [
      {
        link: req.file.filename,
      },
    ],
  };

  console.log(folder);

  const gallery = await Gallery.create(folder);

  res.status(201).json({
    status: 'Success',
    Message: 'Photo Uploaded',
    data: gallery,
  });
});

exports.uploadPhototofolder = catchAsync(async (req, res, next) => {
  if (!req.file.filename) {
    return next(new AppError('Image not found please upload again', 404));
  }

  const gallery = await Gallery.findByIdAndUpdate(req.params.id, {
    $push: { photo: { link: req.file.filename } },
  });

  res.status(201).json({
    status: 'Success',
    Message: 'Photo Uploaded',
    data: gallery,
  });
});

exports.getgallery = factory.getAll(Gallery);

exports.getfolder = factory.getOne(Gallery);
