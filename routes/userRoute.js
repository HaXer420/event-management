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
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    authController.signupfaculty
  );

router.route('/login').post(authController.login);

router.get(
  '/unverifiedstudents',
  authController.protect,
  authController.restrictTo('admin'),
  userController.unverifiedstudents
);

router.get(
  '/studentverify/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.StudentVerify
);

router.get(
  '/allfaculty',
  authController.protect,
  authController.restrictTo('admin'),
  userController.Faculty
);

router.get(
  '/allstudents',
  authController.protect,
  authController.restrictTo('admin'),
  userController.Students
);

router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);

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

router.delete(
  '/disableuser/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.disableUser
);

router.patch(
  '/activeuser/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.ActiveUser
);

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
