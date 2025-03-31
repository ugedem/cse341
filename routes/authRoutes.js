const express = require("express");
const passport = require("passport");

const router = express.Router();

// Route to start GitHub OAuth login
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub OAuth callback route
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login-failed",
    session: false,
  }),
  (req, res) => {
    // Successfully authenticated, send token or user details
    res.json({
      message: "Login successful!",
      user: req.user,
    });
  }
);

module.exports = router;
