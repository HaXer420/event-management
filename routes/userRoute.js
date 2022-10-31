const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const multer = require('../utils/multer');

const router = express.Router();

router
  .route('/signupstudent')
  .post(
    multer.uploadUserImg,
    multer.UserImgResize,
    authController.signupstudent
  );

router
  .route('/signupfaculty')
  .post(authController.restrictTo('admin'), authController.signupfaculty);

router.route('/login').post(authController.login);

router.get(
  '/unverifiedstudents',
  authController.protect,
  authController.restrictTo('admin'),
  userController.unverifiedstudents
);

router
  .route('/updatepassword')
  .patch(authController.protect, authController.updatePass);

router.patch(
  '/updateMe',
  authController.protect,
  multer.uploadUserImg,
  multer.UserImgResize,
  userController.updateMe
);

router
  .route('/getme')
  .get(authController.protect, userController.getMe, userController.getUser);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  userController.getAllUsers
);

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUser
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );

module.exports = router;