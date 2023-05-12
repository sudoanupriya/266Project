const express = require("express");
const controller = require("../controllers/searchController");
const router = express();

router.get("/search", controller.eventSearch);
router.get("/searchRecommendation", controller.autoComplete);

module.exports = router;
