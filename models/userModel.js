const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, 'Name must be greater or equal to 3'],
      maxlength: [50, 'Name must be less or equal to 50'],
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Must have a email'],
      unique: [true, 'Email must not be used before'],
      lowercase: true,
      validate: [validator.isEmail, 'Enter valid email'],
    },
    regno: {
      type: String,
      unique: [true, 'Must be unique'],
    },
    photo: {
      type: String,
      required: [true, 'Must enter Card Photo'],
    },
    department: {
      type: String,
      enum: [
        'BBA',
        'CS',
        'SE',
        'Psychology',
        'EE',
        'CE',
        'ME',
        'Biosciences',
        'Biotechnology',
        'Microbiology',
        'AF',
        'Pharm.D',
        'None',
      ],
    },
    password: {
      type: String,
      required: [true, 'Must have a password'],
      minlength: [8, 'must have >=8 length'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Must have a confirm password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not same',
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'Student', 'Patron', 'HOD', 'Dean', 'unverified'],
      default: 'unverified',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passResetToken: String,
    passTokenExpire: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('events', {
  ref: 'Event',
  foreignField: 'user',
  localField: '_id',
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.correctPassword = async function (
  candPassword,
  userPassword
) {
  return await bcrypt.compare(candPassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimesstamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimeStamp, JWTTimesstamp)
    return JWTTimesstamp < changedTimeStamp;
  }
};
userSchema.methods.passwordResetToken = function () {
  const ResetToken = crypto.randomBytes(32).toString('hex');

  this.passResetToken = crypto
    .createHash('sha256')
    .update(ResetToken)
    .digest('hex');

  // console.log({ ResetToken }, this.passResetToken);

  this.passTokenExpire = Date.now() + 10 * 60 * 1000;

  return ResetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
