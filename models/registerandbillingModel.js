const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const registerSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Register must belong to Student'],
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isRejected: {
    type: Boolean,
    default: false,
  },
  feedback: String,
  proof: {
    type: String,
    required: [true, 'Must attach proof'],
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: [true, 'Register must belong to Event'],
  },
  patron: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Event must belong to society Patron'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

registerSchema.index({ event: 1, user: 1 }, { unique: [true] });

registerSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'student',
    select: 'name regno',
  });
  this.populate({
    path: 'event',
    select: 'title -society -patron -user -feedback',
  });
  this.populate({
    path: 'patron',
    select: 'name',
  });
  next();
});

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
