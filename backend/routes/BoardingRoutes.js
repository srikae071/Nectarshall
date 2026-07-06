const express = require("express");
const router = express.Router();

const { createBoarding } = require("../controllers/BoardingController");

router.post("/create", createBoarding);

module.exports = router;
