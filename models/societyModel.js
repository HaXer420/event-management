const mongoose = require('mongoose');

const societySchema = mongoose.Schema(
  {
    society: String,
    scope: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
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
    patron: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
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
    select: 'name department',
  });
  next();
});

const Society = mongoose.model('Society', societySchema);

module.exports = Society;
