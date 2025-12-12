const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  cancelBooking,
  joinWaitlist,
  modifyBooking,
} = require("../controllers/bookingController");

const { auth } = require("../middleware/auth");

router.post("/", auth, createBooking);
router.get("/me", auth, getUserBookings);

router.put("/cancel/:id", auth, cancelBooking);
router.post("/waitlist", auth, joinWaitlist);
router.put("/update/:id", auth, modifyBooking);

module.exports = router;
