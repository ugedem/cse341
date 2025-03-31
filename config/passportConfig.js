const passport = require("passport");
const { Strategy: GitHubStrategy } = require("passport-github2");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 🔹 GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL, // Use env variable
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("✅ GitHub Profile:", profile); // Debugging
        console.log("🔑 Access Token:", accessToken);

        // 🔹 Ensure GitHub profile ID exists
        if (!profile.id) {
          console.error("❌ GitHub profile is missing an ID");
          return done(new Error("Invalid GitHub profile: missing ID"), false);
        }

        // 🔹 Check if user already exists in DB
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // 🔹 Ensure we get a valid email (GitHub may return null emails)
          const email =
            profile.emails?.[0]?.value || `github_${profile.id}@noemail.com`;

          user = new User({
            githubId: profile.id,
            username: profile.username || `user_${profile.id}`,
            email: email,
          });

          await user.save();
        }

        // 🔹 Generate JWT Token
        let token;
        try {
          token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
        } catch (jwtError) {
          console.error("❌ JWT Token Generation Error:", jwtError);
          return done(jwtError, false);
        }

        return done(null, { user, token });
      } catch (err) {
        console.error("❌ Error in GitHub OAuth Strategy:", err);
        return done(err, false);
      }
    }
  )
);

// 🔹 JWT Strategy for protecting routes
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.userId);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        console.error("❌ Error in JWT Strategy:", err);
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
