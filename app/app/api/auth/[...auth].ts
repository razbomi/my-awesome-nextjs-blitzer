import {passportAuth} from "blitz"
import db from "db"
import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth"

async function verify(accessToken, refreshToken, profile, done) {
  console.log(profile)

  const email = profile.emails && profile.emails[0]?.value
  const picture = profile.photos && profile.photos[0]?.value
  console.log(picture)
  const role = email === "ang4@bigw.com" ? "admin" : "user"
  const user = await db.user.upsert({
    where: {email},
    create: {
      email,
      name: profile.displayName,
      role: role,
      picture: picture
    },
    update: {
      email,
      role: role,
      picture: picture
    }
  })

  const publicData = {userId: user.id, roles: [user.role], source: profile.provider, picture: picture}
  done(null, {publicData})
}
export default passportAuth({
    successRedirectUrl: "/",
    errorRedirectUrl: "/",
    authenticateOptions: {
      scope: ["email", "profile"]
    },
    strategies: [
      new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.GOOGLE_CALLBACK_URL || ""
      }, 
      verify)
    ],
  })