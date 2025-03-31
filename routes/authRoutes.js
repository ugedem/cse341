const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🔹 Start GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// 🔹 GitHub OAuth Callback
router.get("/github/callback", 
  passport.authenticate("github", { session: false }), 
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // 🔹 Extract user and token
    const { user, token } = req.user;

    // 🔹 Send token to frontend
    res.json({ user, token });
  }
);

module.exports = router;
