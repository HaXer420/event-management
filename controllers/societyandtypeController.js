const Society = require('../models/societyModel');
const EType = require('../models/eventtypeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

exports.createSociety = catchAsync(async (req, res, next) => {
  const society = await Society.create(req.body);

  res.status(201).json({
    Message: 'Society Created',
    data: society,
  });
});

exports.assignpatrontosociety = factory.updateOne(Society);

exports.Societybydepartment = catchAsync(async (req, res, next) => {
  const society = await Society.find({
    $or: [
      { department: { $eq: `${req.user.department}` } },
      { department: { $eq: 'None' } },
    ],
  });

  res.status(200).json({
    status: 'success',
    result: society.length,
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
