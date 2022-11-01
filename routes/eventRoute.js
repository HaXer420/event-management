const express = require('express');
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/create',
  authController.protect,
  authController.restrictTo('Student'),
  eventController.createEvent
);

router.delete(
  '/delete/:id',
  authController.protect,
  authController.restrictTo('admin'),
  eventController.deleteEvent
);

router.get(
  '/pendingpatron',
  authController.protect,
  authController.restrictTo('Patron'),
  eventController.pendingPatron
);

router.get(
  '/pendingHOD',
  authController.protect,
  authController.restrictTo('HOD'),
  eventController.pendingHOD
);

module.exports = router;
