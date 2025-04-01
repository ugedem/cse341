const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const dotenv = require("dotenv");

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://cse341-tdwz.onrender.com/api-docs/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you should check if the user exists in the database, if not, create them
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;