const express = require("express");

const {
  getCareerDetails,
} = require("../controllers/careerController");

const router = express.Router();

router.get("/:careerName", getCareerDetails);

module.exports = router;