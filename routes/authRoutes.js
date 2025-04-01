const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

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
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Store JWT in a secure cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    // Redirect to frontend or send token in response
    res.json({ message: "Login successful!", token });
  }
);

// Logout Route (Clears the cookie)
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
