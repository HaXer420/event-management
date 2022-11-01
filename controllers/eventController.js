const Event = require('../models/eventModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

exports.createEvent = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const event = await Event.create(req.body);

  res.status(201).json({
    message: 'success',
    data: event,
  });
});

exports.pendingPatron = catchAsync(async (req, res, next) => {
  const event = await Event.find({
    $and: [
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: false } },
      { isPatronApproved: { $eq: false } },
      { isDeanApproved: { $eq: false } },
    ],
  });

  res.status(200).json({
    result: event.length,
    data: event,
  });
});

exports.pendingHOD = catchAsync(async (req, res, next) => {
  const event = await Event.find({
    $and: [
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: false } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: false } },
    ],
  });

  res.status(200).json({
    result: event.length,
    data: event,
  });
});

exports.deleteEvent = factory.deleteOne(Event);
