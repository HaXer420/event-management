const express = require('express');
const RegisterController = require('../controllers/registerandbilingController');
const authController = require('../controllers/authController');
const multer = require('../utils/multer');

const router = express.Router();

router.post(
  '/create/:id',
  authController.protect,
  authController.restrictTo('Student'),
  multer.uploadUserImg,
  multer.UserImgResize,
  RegisterController.createRegister
);

router.patch(
  '/approve/:id',
  authController.protect,
  authController.restrictTo('Patron'),
  RegisterController.ApproveregistersbyPatron
);

router.patch(
  '/reject/:id',
  authController.protect,
  authController.restrictTo('Patron'),
  RegisterController.RejectregistersbyPatron
);

router.get(
  '/pendingbyPatron',
  authController.protect,
  authController.restrictTo('Patron'),
  RegisterController.PendingregistersbyPatron
);

router.get(
  '/myregisters',
  authController.protect,
  authController.restrictTo('Student'),
  RegisterController.MyRegisters
);

// router.get('/', galleryController.getgallery);

// router.get('/folder/:id', galleryController.getfolder);

module.exports = router;
