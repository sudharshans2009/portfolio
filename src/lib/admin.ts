import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/database/client";
import { user } from "@/database/schema";
import { OWNER_EMAIL } from "@/lib/admin-constants";

export { OWNER_EMAIL };

export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const email = session.user.email.toLowerCase();
  const [account] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);
  if (email === OWNER_EMAIL || account?.role === "admin") {
    return session;
  }

  return null;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session)
    throw new Error("You do not have permission to perform this action.");
  return session;
}

export async function ensureOwnerAdmin() {
  await db
    .update(user)
    .set({ role: "admin" })
    .where(eq(user.email, OWNER_EMAIL));
}
