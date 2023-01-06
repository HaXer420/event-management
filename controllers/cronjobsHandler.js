const cron = require('node-cron');
const Event = require('../models/eventModel');
const catchAsync = require('../utils/catchAsync');

cron.schedule(
  '* * * * * 7',
  catchAsync(async () => {
    console.log('running every Sunday');

    const eventdelete = await Event.deleteMany({
      $or: [{ isRejected: { $eq: true } }, { startdate: { $lt: Date.now() } }],
    });
  })
);

module.exports = cron;
