const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    title: String,
    proposedvenue: String,
    duration: {
      type: String,
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
    Societyname: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Post must belong to user'],
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
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
