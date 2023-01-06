const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    title: String,
    proposedvenue: String,
    duration: {
      type: String,
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
      ],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    bank: {
      bankname: String,
      accnumber: String,
      amount: Number,
    },
    supervisfacname: String,
    guestspeakrname: String,
    student: [
      {
        stdname: String,
        stdregno: String,
        stdrole: String,
      },
    ],
    contctprsnname: String,
    contctpersonregno: String,
    contctpersonmobile: Number,
    sashes: {
      type: Boolean,
      default: false,
    },
    panaflex: {
      type: Boolean,
      default: false,
    },
    mediacoverage: {
      type: Boolean,
      default: false,
    },
    refreshments: {
      type: Boolean,
      default: false,
    },
    transport: {
      type: Boolean,
      default: false,
    },
    shield: {
      type: Boolean,
      default: false,
    },
    startdate: {
      type: Date,
    },
    isAdminApproved: {
      type: Boolean,
      default: false,
    },
    isHODApproved: {
      type: Boolean,
      default: false,
    },
    isPatronApproved: {
      type: Boolean,
      default: false,
    },
    isDeanApproved: {
      type: Boolean,
      default: false,
    },
    society: {
      type: mongoose.Schema.ObjectId,
      ref: 'Society',
      required: [true, 'Event must belong to society'],
    },
    patron: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Event must belong to society Patron'],
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Post must belong to user'],
    },
    feedback: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: [true, 'Feedback must belong to User'],
        },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
  this.populate({
    path: 'society',
    select: 'society -patron',
  });
  this.populate({
    path: 'patron',
    select: 'name',
  });
  this.populate({
    path: 'feedback.user',
    select: 'name role',
  });
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
