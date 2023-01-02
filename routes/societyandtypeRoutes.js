const express = require('express');
const societyandtypeController = require('../controllers/societyandtypeController');
const authController = require('../controllers/authController');

const router = express.Router();

//// Societies
router.post(
  '/createsociety',
  authController.protect,
  authController.restrictTo('admin'),
  societyandtypeController.createSociety
);

router.get('/allsocites', societyandtypeController.getallSocities);
router.delete(
  '/deletesociety/:id',
  authController.protect,
  authController.restrictTo('admin'),
  societyandtypeController.deleteSociety
);
//// Types
router.post(
  '/createtype',
  authController.protect,
  authController.restrictTo('admin'),
  societyandtypeController.createEType
);

router.get('/alleventtypes', societyandtypeController.getallTypes);

router.delete(
  '/deleteetypes/:id',
  authController.protect,
  authController.restrictTo('admin'),
  societyandtypeController.deleteType
);

router.patch(
  '/assignpat/:id',
  authController.protect,
  authController.restrictTo('admin'),
  societyandtypeController.assignpatrontosociety
);

router.get(
  '/societbydepartment/:id',
  societyandtypeController.Societybydepartment
);

module.exports = router;
