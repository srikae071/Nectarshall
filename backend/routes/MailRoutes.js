const express = require("express");
const router = express.Router();
const { sendNotificationEmail } = require("../controllers/MailController");

router.post("/send-notification", sendNotificationEmail);

module.exports = router;
