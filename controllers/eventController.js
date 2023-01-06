const moment = require('moment');
const Event = require('../models/eventModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

exports.createEvent = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  req.body.contctprsnname = req.user.name;
  req.body.contctpersonregno = req.user.regno;

  req.body.startdate = moment(req.body.startdate, 'YYYY-MM-DD');

  if (req.body.startdate < Date.now())
    return next(new AppError('You cannot choose past date for event!', 400));

  // const result = req.params.id.slice(4, 15);
  // console.log(result);
  // result = new Date(result);
  // console.log(result);

  // const StartDate = moment(result).format("YYYY-MM-DD");
  // console.log(StartDate);

  const eventfind = await Event.find({
    $and: [
      { isAdminApproved: { $eq: true } },
      { startdate: { $eq: req.body.startdate } },
    ],
  });

  if (eventfind.length >= 4)
    return next(
      new AppError(
        `There is already 4 approved events on ${req.body.startdate}. Please choose another day for your event`,
        404
      )
    );

  const event = await Event.create(req.body);

  res.status(201).json({
    message: 'success',
    data: event,
  });
});

exports.pendingPatron = catchAsync(async (req, res, next) => {
  const eventpaid = await Event.find({
    $and: [
      { department: { $eq: `${req.user.department}` } },
      { patron: { $eq: `${req.user.id}` } },
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: false } },
      { isPatronApproved: { $eq: false } },
      { isDeanApproved: { $eq: false } },
      { isRejected: { $eq: false } },
      { isPaid: { $eq: true } },
    ],
  });

  const eventfree = await Event.find({
    $and: [
      { department: { $eq: `${req.user.department}` } },
      { patron: { $eq: `${req.user.id}` } },
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: false } },
      { isPatronApproved: { $eq: false } },
      { isDeanApproved: { $eq: false } },
      { isRejected: { $eq: false } },
      { isPaid: { $eq: false } },
    ],
  });

  res.status(200).json({
    resultpaid: eventpaid.length,
    resultfree: eventfree.length,
    PaidEvents: eventpaid,
    FreeEvents: eventfree,
  });
});

exports.pendingHOD = catchAsync(async (req, res, next) => {
  const eventpaid = await Event.find({
    $and: [
      { department: { $eq: `${req.user.department}` } },
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: false } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: false } },
      { isPaid: { $eq: true } },
    ],
  });

  const eventfree = await Event.find({
    $and: [
      { department: { $eq: `${req.user.department}` } },
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: false } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: false } },
      { isPaid: { $eq: false } },
    ],
  });

  res.status(200).json({
    resultpaid: eventpaid.length,
    resultfree: eventfree.length,
    PaidEvents: eventpaid,
    FreeEvents: eventfree,
  });
});

exports.pendingDean = catchAsync(async (req, res, next) => {
  const eventpaid = await Event.find({
    $and: [
      { department: { $eq: `${req.user.department}` } },
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: true } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: false } },
      { isPaid: { $eq: true } },
    ],
  });

  const eventfree = await Event.find({
    $and: [
      { department: { $eq: `${req.user.department}` } },
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: true } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: false } },
      { isPaid: { $eq: false } },
    ],
  });

  res.status(200).json({
    resultpaid: eventpaid.length,
    resultfree: eventfree.length,
    PaidEvents: eventpaid,
    FreeEvents: eventfree,
  });
});

exports.pendingAdmin = catchAsync(async (req, res, next) => {
  const eventpaid = await Event.find({
    $and: [
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: true } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: true } },
      { isPaid: { $eq: true } },
    ],
  });

  const eventfree = await Event.find({
    $and: [
      { isAdminApproved: { $eq: false } },
      { isHODApproved: { $eq: true } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: true } },
      { isPaid: { $eq: false } },
    ],
  });

  res.status(200).json({
    resultpaid: eventpaid.length,
    resultfree: eventfree.length,
    PaidEvents: eventpaid,
    FreeEvents: eventfree,
  });
});

// approve events
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

// reject events
exports.patronReject = catchAsync(async (req, res, next) => {
  const feeedback = [{ user: req.user.id, message: req.body.message }];

  const event = await Event.updateOne(
    { _id: req.params.id },
    { $push: { feedback: feeedback }, isRejected: true }
  );
  console.log(event);
  // event.feedback = feeedback;
  // event.isRejected = true;
  // event.save({ validateBeforeSave: false });

  res.status(200).json({
    message: 'Event Rejected!',
  });
});

exports.hodReject = catchAsync(async (req, res, next) => {
  // const event = await Event.findById(req.params.id);

  const feeedback = [{ user: req.user.id, message: req.body.message }];

  const event = await Event.updateOne(
    { _id: req.params.id },
    { $push: { feedback: feeedback }, isPatronApproved: false }
  );

  // event.feedback = feeedback;
  // event.isPatronApproved = false;
  // event.save({ validateBeforeSave: false });

  res.status(200).json({
    message: 'Event Rejected!',
  });
});

exports.deanReject = catchAsync(async (req, res, next) => {
  const feeedback = [{ user: req.user.id, message: req.body.message }];

  const event = await Event.updateOne(
    { _id: req.params.id },
    { $push: { feedback: feeedback }, isHODApproved: false }
  );

  // event.isHODApproved = false;
  // event.save({ validateBeforeSave: false });

  res.status(200).json({
    message: 'Event Rejected!',
  });
});

exports.upcomingevents = catchAsync(async (req, res, next) => {
  const nowdate = moment().format();
  const eventpaid = await Event.find({
    $and: [
      { isAdminApproved: { $eq: true } },
      { startdate: { $gt: nowdate } },
      { department: { $eq: `${req.user.department}` } },
      { isPaid: { $eq: true } },
    ],
  });
  const eventfree = await Event.find({
    $and: [
      { isAdminApproved: { $eq: true } },
      { startdate: { $gt: nowdate } },
      { department: { $eq: `${req.user.department}` } },
      { isPaid: { $eq: false } },
    ],
  });
  res.status(200).json({
    resultpaid: eventpaid.length,
    resultfree: eventfree.length,
    PaidEvents: eventpaid,
    FreeEvents: eventfree,
  });
});

exports.eventbysociety = catchAsync(async (req, res, next) => {
  const eventpaid = await Event.find({
    $and: [
      { isAdminApproved: { $eq: true } },
      { society: { $eq: req.params.id } },
      { isPaid: { $eq: true } },
    ],
  });
  const eventfree = await Event.find({
    $and: [
      { isAdminApproved: { $eq: true } },
      { society: { $eq: req.params.id } },
      { isPaid: { $eq: false } },
    ],
  });

  res.status(200).json({
    resultpaid: eventpaid.length,
    resultfree: eventfree.length,
    PaidEvents: eventpaid,
    FreeEvents: eventfree,
  });
});

exports.deleteEvent = factory.deleteOne(Event);
exports.getOneEVent = factory.getOne(Event);

exports.getallapprovedeventsbyfaculty = catchAsync(async (req, res, next) => {
  const eventpaid = await Event.find({
    $and: [
      { department: { $eq: `${req.user.department}` } },
      { isAdminApproved: { $eq: true } },
      { isHODApproved: { $eq: true } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: true } },
      { isPaid: { $eq: true } },
    ],
  });

  const eventfree = await Event.find({
    $and: [
      { department: { $eq: `${req.user.department}` } },
      { isAdminApproved: { $eq: true } },
      { isHODApproved: { $eq: true } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: true } },
      { isPaid: { $eq: false } },
    ],
  });

  res.status(200).json({
    resultpaid: eventpaid.length,
    resultfree: eventfree.length,
    PaidEvents: eventpaid,
    FreeEvents: eventfree,
  });
});

exports.getallapprovedeventsbyadmin = catchAsync(async (req, res, next) => {
  const eventpaid = await Event.find({
    $and: [
      { isAdminApproved: { $eq: true } },
      { isHODApproved: { $eq: true } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: true } },
      { isPaid: { $eq: true } },
    ],
  });

  const eventfree = await Event.find({
    $and: [
      { isAdminApproved: { $eq: true } },
      { isHODApproved: { $eq: true } },
      { isPatronApproved: { $eq: true } },
      { isDeanApproved: { $eq: true } },
      { isPaid: { $eq: false } },
    ],
  });

  res.status(200).json({
    resultpaid: eventpaid.length,
    resultfree: eventfree.length,
    PaidEvents: eventpaid,
    FreeEvents: eventfree,
  });
});

exports.eventbydate = catchAsync(async (req, res, next) => {
  let result = req.params.id.slice(4, 15);
  // console.log(result);
  // result = new Date(result);
  // console.log(result);

  const StartDate = moment(result).format('MM-DD-YYYY');
  console.log(StartDate);

  if (StartDate < Date.now())
    return next(new AppError('You cannot choose past date for event!', 400));

  const eventpaid = await Event.find({
    $and: [
      { department: { $eq: `${req.user.department}` } },
      { isAdminApproved: { $eq: true } },
      { startdate: { $eq: StartDate } },
      { isPaid: { $eq: true } },
    ],
  });

  const eventfree = await Event.find({
    $and: [
      { department: { $eq: `${req.user.department}` } },
      { isAdminApproved: { $eq: true } },
      { startdate: { $eq: StartDate } },
      { isPaid: { $eq: false } },
    ],
  });
  res.status(200).json({
    resultpaid: eventpaid.length,
    resultfree: eventfree.length,
    PaidEvents: eventpaid,
    FreeEvents: eventfree,
  });
});
