const mongoose = require('mongoose');

const societySchema = mongoose.Schema(
  {
    society: String,
    scope: [
      {
        description: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    patron: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Society must belong to Patron'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
societySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'patron',
    select: 'name',
  });
  next();
});

const Society = mongoose.model('Society', societySchema);

module.exports = Society;
