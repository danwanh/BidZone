import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import User from "../models/user.model.js";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  BASE_URL,
} = process.env;

// A small helper
async function findOrCreateOAuth(profile, provider) {
  const email = profile.emails?.[0]?.value;

  let user = await User.findOne({
    $or: [{ email }, { [`oauth.${provider}.id`]: profile.id }],
  });

  if (!user) {
    user = new User({
      name: profile.displayName,
      username: profile.displayName,
      email,
      password_hash: "",
      phone: "",
      address: "",
      dob: null,
      oauth: { [provider]: { id: profile.id, raw: profile } },
      is_verified: false,
      role: "bidder",
      rating_pos: 0,
      rating_neg: 0,
    });
  } else {
    if (!user.oauth[provider]) {
      user.oauth[provider] = { id: profile.id, raw: profile };
    }
  }

  await user.save();
  return user;
}

// GOOGLE
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/auth/google/callback`,
    },
    async (_, __, profile, done) => {
      try {
        const user = await findOrCreateOAuth(profile, "google");
        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

// FACEBOOK
passport.use(
  new FacebookStrategy.Strategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails"],
    },
    async (_, __, profile, done) => {
      try {
        const user = await findOrCreateOAuth(profile, "facebook");
        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

export default passport;
