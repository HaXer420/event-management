const Register = require("../models/registerandbillingModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const Event = require("../models/eventModel");

exports.createRegister = catchAsync(async (req, res, next) => {
  if (!req.file.filename) {
    return next(new AppError("Image not found please upload again", 404));
  }

  const fevent = await Event.findById(req.params.id);

  if (!fevent) return next(new AppError("Event not found", 400));

  // console.log({ fevent });
  // if (fevent.user.id === req.user.id)
  //   return next(new AppError("You Cannot Register on your own event", 400));

  if (fevent.isPaid === false)
    return next(new AppError("Event is Free no need to register!", 400));

  if (fevent.isAdminApproved === false)
    return next(new AppError("Event not approved!", 400));

  req.body.patron = fevent.patron;
  req.body.proof = req.file.filename;
  req.body.student = req.user.id;
  req.body.event = req.params.id;

  const register = await Register.create(req.body);

  res.status(201).json({
    status: "Success",
    Message:
      "Your Request has been sent to the Patron. Please wait for the approval!",
    data: register,
  });
});

exports.PendingregistersbyPatron = catchAsync(async (req, res, next) => {
  const registerpending = await Register.find({
    $and: [
      { patron: { $eq: req.user.id } },
      { isApproved: { $eq: false } },
      { isRejected: { $eq: false } },
    ],
  });
  res.status(200).json({
    status: "Success",
    total: registerpending.length,
    data: registerpending,
  });
});

exports.ApproveregistersbyPatron = catchAsync(async (req, res, next) => {
  const registerpendingapprove = await Register.findById(req.params.id);

  registerpendingapprove.isApproved = true;
  registerpendingapprove.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "Success",
    message: "Register Approved!",
  });
});

exports.RejectregistersbyPatron = catchAsync(async (req, res, next) => {
  const registerpendingapprove = await Register.findById(req.params.id);

  registerpendingapprove.isRejected = true;
  registerpendingapprove.feedback = req.body.feedback;
  registerpendingapprove.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "Success",
    message: "Register Rejected!",
  });
});

// exports.MyRegisters = catchAsync(async (req, res, next) => {
//   const myregs = await Register.find({ student: { $eq: req.user.id } });
//   res.status(200).json({
//     status: "Success",
//     total: myregs.length,
//     data: myregs,
//   });
// });
exports.MyRegisters = catchAsync(async (req, res, next) => {
  const myregs = await Register.find({
    student: { $in: [req.user.id] },
  });
  res.status(200).json({
    status: "Success",
    total: myregs.length,
    data: myregs,
  });
});

exports.allregisters = factory.getAll(Register);

exports.oneregister = factory.getOne(Register);
