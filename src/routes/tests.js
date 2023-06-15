const express = require("express");
const { zero, one, query } = require("../controllers/tests.js");

const auth = require("../middleware/auth.js");

const router = express.Router();

router.get("/", zero);
router.get("/one", one);
router.get("/query", query);

module.exports = router;
