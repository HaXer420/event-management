const express = require("express");
const eventController = require("../controllers/eventController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/create",
  authController.protect,
  authController.restrictTo("Student"),
  eventController.createEvent
);

router.delete(
  "/delete/:id",
  authController.protect,
  authController.restrictTo("admin", "Patron", "Dean", "HOD"),
  eventController.deleteEvent
);

router.get(
  "/pendingpatron",
  authController.protect,
  authController.restrictTo("Patron"),
  eventController.pendingPatron
);

router.get(
  "/pendingHOD",
  authController.protect,
  authController.restrictTo("HOD"),
  eventController.pendingHOD
);

router.get(
  "/pendingDean",
  authController.protect,
  authController.restrictTo("Dean"),
  eventController.pendingDean
);

router.get(
  "/pendingAdmin",
  authController.protect,
  authController.restrictTo("admin"),
  eventController.pendingAdmin
);

router.patch(
  "/approvepatron/:id",
  authController.protect,
  authController.restrictTo("Patron"),
  eventController.patronapprove
);

router.patch(
  "/approvehod/:id",
  authController.protect,
  authController.restrictTo("HOD"),
  eventController.hodapprove
);

router.patch(
  "/approvedean/:id",
  authController.protect,
  authController.restrictTo("Dean"),
  eventController.deanapprove
);

router.patch(
  "/approveadmin/:id",
  authController.protect,
  authController.restrictTo("admin"),
  eventController.adminapprove
);

router.patch(
  "/rejectpatron/:id",
  authController.protect,
  authController.restrictTo("Patron"),
  eventController.patronReject
);

router.patch(
  "/rejecthod/:id",
  authController.protect,
  authController.restrictTo("HOD"),
  eventController.hodReject
);

router.patch(
  "/rejectdean/:id",
  authController.protect,
  authController.restrictTo("Dean"),
  eventController.deanReject
);

router.patch(
  "/rejectadmin/:id",
  authController.protect,
  authController.restrictTo("admin"),
  eventController.adminReject
);

router.get(
  "/oneevent/:id",
  authController.protect,
  eventController.getOneEVent
);

router.get(
  "/getallevents",
  authController.protect,
  authController.restrictTo("admin", "Dean", "HOD", "Patron"),
  eventController.getallevents
);

router.get(
  "/eventbysociety/:id",
  authController.protect,
  eventController.eventbysociety
);

router.get("/upcoming", eventController.upcomingevents);

router.get(
  "/eventbydate/:id",
  authController.protect,
  eventController.eventbydate
);

module.exports = router;
