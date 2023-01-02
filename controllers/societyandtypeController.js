const Society = require('../models/societyModel');
const EType = require('../models/eventtypeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

exports.createSociety = catchAsync(async (req, res, next) => {
  req.body.patron = req.user.id;

  const society = await Society.create(req.body);

  res.status(201).json({
    Message: 'Society Created',
    data: society,
  });
});

exports.createEType = catchAsync(async (req, res, next) => {
  const society = await EType.create(req.body);

  res.status(201).json({
    Message: 'Society Created',
    data: society,
  });
});

exports.getallSocities = factory.getAll(Society);
exports.getallTypes = factory.getAll(EType);

exports.deleteSociety = factory.deleteOne(Society);
exports.deleteType = factory.deleteOne(EType);
