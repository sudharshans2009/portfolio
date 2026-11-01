import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database/client";
import * as schema from "@/database/schema";
import { Resend } from "resend";

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "ssme-local-development-secret-change-me",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error("RESEND_API_KEY is not configured.");
      }

      const resend = new Resend(apiKey);
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "SS.me <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your SS.me password",
        text: `Hi ${user.name || "there"},\n\nUse this link to reset your SS.me password:\n${url}\n\nIf you did not request this, you can ignore this email.`,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, newEmail }) => {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error("RESEND_API_KEY is not configured.");
      }

      const resend = new Resend(apiKey);
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "SS.me <onboarding@resend.dev>",
        to: newEmail || user.email,
        subject: newEmail ? "Confirm your new SS.me email" : "Verify your SS.me email",
        text: `Hi ${user.name || "there"},\n\nConfirm your email address here:\n${url}\n\nIf you did not request this, you can ignore this email.`,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: true,
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
});
