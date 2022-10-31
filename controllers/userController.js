const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');
const cloudinary = require('../utils/cloudinary');

const currentObj = (obj, ...fieldsallowed) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fieldsallowed.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update please use update password route for that!',
        400
      )
    );
  }

  const filterObject = currentObj(req.body, 'name', 'email');

  if (req.file) filterObject.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterObject, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const userD = await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.unverifiedstudents = catchAsync(async (req, res, next) => {
  const user = await User.aggregate([
    {
      $match: { role: 'unverified', temprole: 'Student' },
    },
  ]);

  res.status(200).json({
    status: 'success',
    result: user.length,
    data: user,
  });
});

exports.StudentVerify = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No User found with the given ID', 400));
  }

  if (!user.temprole) {
    return next(new AppError('Student Already Verified', 400));
  }

  user.role = user.temprole;
  user.temprole = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ message: 'Account Verified!', data: user });
});

exports.Faculty = catchAsync(async (req, res, next) => {
  const faculty = await User.find({
    $or: [{ role: { $ne: 'Student' } }, { temprole: { $ne: 'Student' } }],
  });

  res.status(200).json({
    status: 'success',
    result: faculty.length,
    data: faculty,
  });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
