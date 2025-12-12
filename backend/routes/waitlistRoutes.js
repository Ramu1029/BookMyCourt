const express = require("express");
const router = express.Router();

const { getMyWaitlist, getAllWaitlist } = require("../controllers/waitlistController");
const { auth, admin } = require("../middleware/auth");

router.get("/mine", auth, getMyWaitlist);
router.get("/admin/all", auth, admin, getAllWaitlist);

module.exports = router;
