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

exports.pendingDean = catchAsync(async (req, res, next) => {
  const event = await Event.find({
    $and: [
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: true } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: false } },
    ],
  });

  res.status(200).json({
    result: event.length,
    data: event,
  });
});

exports.pendingAdmin = catchAsync(async (req, res, next) => {
  const event = await Event.find({
    $and: [
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: true } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: true } },
    ],
  });

  res.status(200).json({
    result: event.length,
    data: event,
  });
});

exports.patronapprove = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  event.isPatronApproved = true;
  event.save({ validateBeforeSave: false });

  res.status(200).json({
    message: 'Event Approved!',
  });
});

exports.hodapprove = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  event.isHODApproved = true;
  event.save({ validateBeforeSave: false });

  res.status(200).json({
    message: 'Event Approved!',
  });
});

exports.deanapprove = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  event.isDeanApproved = true;
  event.save({ validateBeforeSave: false });

  res.status(200).json({
    message: 'Event Approved!',
  });
});

exports.adminapprove = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  event.isAdminApproved = true;
  event.save({ validateBeforeSave: false });

  res.status(200).json({
    message: 'Event Approved!',
  });
});

exports.upcomingevents = catchAsync(async (req, res, next) => {
  const event = await Event.find({
    $and: [
      { isAdminApproved: { $eq: true } },
      { startdate: { $lt: Date.now() } },
    ],
  });

  res.status(200).json({
    result: event.length,
    data: event,
  });
});

exports.deleteEvent = factory.deleteOne(Event);
exports.getOneEVent = factory.getOne(Event);
exports.getallevents = catchAsync(async (req, res, next) => {
  const event = await Event.find({
    $and: [
      { isAdminApproved: { $eq: true } },
      { isHODApproved: { $eq: true } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: true } },
    ],
  });

  res.status(200).json({
    result: event.length,
    data: event,
  });
});
