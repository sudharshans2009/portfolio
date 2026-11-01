"use server";

import { db } from "@/database/client";
import { message } from "@/database/schema";
import { z } from "zod";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  body: z.string().trim().min(10, "Please write a little more.").max(5000),
});

export type ContactState = {
  success: boolean;
  message: string;
};

export async function submitContact(
  _previousState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const requestHeaders = await headers();
  const address =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  const rateLimit = checkRateLimit(`contact:${address}`, 5, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return { success: false, message: "Too many messages. Please try again later." };
  }

  if (formData.get("website")) {
    return { success: true, message: "Thanks — your message is on its way." };
  }

  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) {
    return {
      success: false,
      message: "Please sign in before sending a message.",
    };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Please check your details.",
    };
  }

  try {
    await db.insert(message).values({
      id: crypto.randomUUID(),
      name: parsed.data.name,
      email: parsed.data.email,
      body: parsed.data.body,
    });

  } catch (error) {
    console.error("Contact message could not be saved", error);
    return {
      success: false,
      message: "We couldn’t save your message. Please try again.",
    };
  }

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured.");
    }

    const resend = new Resend(resendApiKey);
    const emailContent = `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\nMessage:\n${parsed.data.body}`;
    const [userEmail, ownerEmail] = await Promise.all([
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "SS.me <onboarding@resend.dev>",
        to: parsed.data.email,
        subject: "Your message to SS.me was received",
        text: `Hi ${parsed.data.name},\n\nYour message was successfully received by Sudharshan.\n\n${emailContent}\n\nThanks for reaching out.`,
      }),
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "SS.me <onboarding@resend.dev>",
        to: siteConfig.ownerEmail,
        replyTo: parsed.data.email,
        subject: `New SS.me contact message from ${parsed.data.name}`,
        text: emailContent,
      }),
    ]);

    if (userEmail.error || ownerEmail.error) {
      console.error("Contact email delivery failed", userEmail.error || ownerEmail.error);
      return {
        success: false,
        message: "Your message was saved, but email delivery failed. Please try again later.",
      };
    }

    return { success: true, message: "Thanks — your message is on its way." };
  } catch (error) {
    console.error("Contact email delivery failed", error);
    return {
      success: false,
      message: "Your message was saved, but email delivery failed. Please try again later.",
    };
  }
}
