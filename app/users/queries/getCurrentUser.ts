import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const user = await db.user.findOne({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, picture: true },
  })

  return user
}
