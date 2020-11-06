import { passportAuth } from "blitz"
import db from "db"
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth"

async function verify(accessToken, refreshToken, profile, done) {
  console.log(accessToken, refreshToken, profile, done)

  const email = profile.emails && profile.emails[0]?.value
  const user = await db.user.upsert({
    where: { email },
    create: {
      email,
      name: profile.displayName,
    },
    update: { email },
  })

  const publicData = { userId: user.id, roles: [user.role], source: profile.provider }
  done(null, { publicData })
}

export default passportAuth({
  successRedirectUrl: "/",
  errorRedirectUrl: "/",
  authenticateOptions: {
    scope: ["email", "profile"],
  },
  strategies: [
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
      },
      verify
    ),
  ],
})
