const express = require("express");
const { getItems, createItem } = require("../controllers/itemController");
const passport = require("passport");

const router = express.Router();
router.get("/", getItems);
router.post("/", passport.authenticate("jwt", { session: false }), createItem);

module.exports = router;
