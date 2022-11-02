const express = require('express');
const galleryController = require('../controllers/galleryController');
const authController = require('../controllers/authController');
const multer = require('../utils/multer');

const router = express.Router();

router.post(
  '/create',
  authController.protect,
  authController.restrictTo('admin'),
  multer.uploadUserImg,
  multer.UserImgResize,
  galleryController.uploadPhoto
);

router.get('/', galleryController.getgallery);

module.exports = router;
