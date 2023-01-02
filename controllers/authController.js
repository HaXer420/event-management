const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signInToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const signinUser = (user, statuscode, res) => {
  const token = signInToken(user._id);

  ////////////////////////////////////
  // this code is for https secure heroku connection if needed

  // res.cookie('jwt', token, {
  //   expires: new Date(
  //     Date.now() + process.env.EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000
  //   ),
  //   httpOnly: true,
  //   secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  // });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // not to show in the field
  user.password = undefined;

  res.status(statuscode).json({
    status: 'success',
    token,
    data: {
      user: user.id,
      role: user.role,
      department: user.department,
      isVerified: user.isVerified,
    },
  });
};

exports.signupstudent = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    regno: req.body.regno,
    username: Math.random(20),
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    department: req.body.department,
    role: 'Student',
    photo: req.file.filename,
  });

  //   req.token = signInNewUser(newUser._id, 201, res);

  //   req.user = newUser;

  //   const token = signInToken(newUser._id);

  res.status(201).json({
    status: 'success',
    message: 'Account Created Successfully!',
    data: {
      Name: newUser.name,
      role: newUser.role,
    },
  });
});

exports.signupfaculty = catchAsync(async (req, res, next) => {
  const factemp = req.body.username;

  if (!factemp.includes('.'))
    return next(new AppError('Username must have dot(.) in it!', 400));

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    regno: Math.random(20),
    photo: Math.random(20),
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    department: req.body.department,
    role: req.body.role,
    isVerified: true,
  });

  //   req.token = signInNewUser(newUser._id, 201, res);

  //   req.user = newUser;

  //   const token = signInToken(newUser._id);

  res.status(201).json({
    status: 'success',
    message: 'Account created!',
    data: {
      user: newUser.name,
      role: newUser.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // let userlogin;
  let regno;
  let username;
  const { user, password } = req.body;
  // if (req.body.username) {
  //   userlogin = req.body.username;
  // } else if (req.body.email) {
  //   userlogin = req.body.email;
  // }

  if (!user || !password) {
    // console.log('hi');
    return next(new AppError('Account or password is not entered', 400));
  }

  if (user.includes('.')) {
    username = req.body.user;
  } else if (!user.includes('.')) {
    regno = req.body.user;
  }
  // const user = await User.findOne({ email }).select('+password');

  const user1 = await User.findOne({
    $or: [{ regno: regno }, { username: username }],
  }).select('+password');

  if (!user1 || !(await user1.correctPassword(password, user1.password))) {
    // console.log('hi');
    return next(new AppError('Account or password is not correct', 401));
  }

  signinUser(user1, 201, res);

  // const token = signInToken(user._id);
  // res.status(201).json({
  //   status: 'success',
  //   token,
  // });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Getting Token and check if its true or correct
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // console.log(req.headers);
  if (!token) {
    return next(
      new AppError('You are not logged in please login to view the data', 401)
    );
  }
  //  verifying the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  //Checking if the user still exists
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exist', 401)
    );
  }
  //Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed the password please relogin', 401)
    );
  }

  //Grant Access to Protected Route
  // console.log(decoded);
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = function (...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user email
  const user = await User.findOne({ email: req.body.email });

  // see if email exist

  if (!user) {
    return next(new AppError('Email not found Please enter a valid one!'));
  }

  //generate reset token
  const resetToken = user.passwordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `http://localhost:3000/changepassword/${resetToken}`;

  const message = `Forgot your password? submit patch request on the given link for the new password ${resetURL} \n If you dont do this please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Token is valid for 10mins',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to the email provided',
    });
  } catch (err) {
    user.passResetToken = undefined;
    user.passTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was error sending email please try again later!', 500)
    );
    // res.status(500).json({
    //   status: 'error',
    //   message: err.message,
    // });
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passResetToken: hashedToken,
    passTokenExpire: { $gt: Date.now() },
  });
  // check if user exist
  if (!user) {
    return next(new AppError('Your token is invalid or expired', 400));
  }
  // console.log('hi');
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passResetToken = undefined;
  user.passTokenExpire = undefined;
  await user.save();
  // send token along with new password

  signinUser(user._id, 201, res);

  // const token = signInToken(user._id);
  // res.status(201).json({
  //   status: 'success',
  //   token,
  // });
});

exports.updatePass = catchAsync(async (req, res, next) => {
  // getting user
  const user = await User.findById(req.user.id).select('+password');
  // check if user password is correct
  // console.log(user);
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is incorrect!', 401));
  }
  // update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //login user
  signinUser(user._id, 201, res);
});
