"use server";

import { eq, isNotNull, isNull } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/database/client";
import { message, project, user } from "@/database/schema";
import { OWNER_EMAIL, requireAdmin } from "@/lib/admin";

export type AdminActionState = { success: boolean; message: string };

const failed = (error: unknown): AdminActionState => {
  console.error("Admin action failed", error);
  return { success: false, message: error instanceof Error ? error.message : "The action could not be completed." };
};

export async function updateUserRole(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const userId = z.string().min(1).parse(formData.get("userId"));
    const role = z.enum(["admin", "user"]).parse(formData.get("role"));
    const [target] = await db.select({ email: user.email }).from(user).where(eq(user.id, userId)).limit(1);
    if (!target) return { success: false, message: "User not found." };
    if (target.email.toLowerCase() === OWNER_EMAIL) {
      return { success: false, message: "The permanent owner cannot be demoted." };
    }
    await db.update(user).set({ role, updatedAt: new Date() }).where(eq(user.id, userId));
    revalidatePath("/admin");
    return { success: true, message: `User updated to ${role}.` };
  } catch (error) {
    return failed(error);
  }
}

export async function updateMessage(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const id = z.string().min(1).parse(formData.get("id"));
    const action = z.enum(["read", "trash", "restore", "delete"]).parse(formData.get("action"));
    if (action === "read") await db.update(message).set({ read: true }).where(eq(message.id, id));
    if (action === "trash") await db.update(message).set({ deletedAt: new Date() }).where(eq(message.id, id));
    if (action === "restore") await db.update(message).set({ deletedAt: null }).where(eq(message.id, id));
    if (action === "delete") await db.delete(message).where(eq(message.id, id));
    revalidatePath("/admin");
    return { success: true, message: action === "delete" ? "Message permanently deleted." : "Message updated." };
  } catch (error) {
    return failed(error);
  }
}

const projectSchema = z.object({
  id: z.string().optional(),
  githubName: z.string().trim().max(120).optional(),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500),
  url: z.string().url(),
  language: z.string().trim().max(80),
  topics: z.string().max(500),
  featured: z.boolean(),
  visible: z.boolean(),
});

export async function saveProject(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = projectSchema.parse({
      id: formData.get("id") || undefined,
      githubName: formData.get("githubName") || undefined,
      name: formData.get("name"),
      description: formData.get("description") || "",
      url: formData.get("url"),
      language: formData.get("language") || "",
      topics: formData.get("topics") || "",
      featured: formData.get("featured") === "on",
      visible: formData.get("visible") === "on",
    });
    const values = {
      githubName: parsed.githubName || null,
      name: parsed.name,
      description: parsed.description || null,
      url: parsed.url,
      language: parsed.language || null,
      topics: parsed.topics.split(",").map((topic) => topic.trim()).filter(Boolean),
      featured: parsed.featured,
      visible: parsed.visible,
      updatedAt: new Date(),
    };
    const existing = parsed.id
      ? await db.select({ id: project.id }).from(project).where(eq(project.id, parsed.id)).limit(1)
      : parsed.githubName
        ? await db.select({ id: project.id }).from(project).where(eq(project.githubName, parsed.githubName)).limit(1)
        : [];
    if (existing[0]) {
      await db.update(project).set(values).where(eq(project.id, existing[0].id));
    } else {
      await db.insert(project).values({ id: crypto.randomUUID(), ...values });
    }
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/about");
    revalidateTag("managed-projects", "max");
    revalidatePath("/admin");
    return { success: true, message: "Project saved." };
  } catch (error) {
    return failed(error);
  }
}

export async function deleteProject(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const id = z.string().min(1).parse(formData.get("id"));
    await db.delete(project).where(eq(project.id, id));
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/about");
    revalidateTag("managed-projects", "max");
    revalidatePath("/admin");
    return { success: true, message: "Project settings removed." };
  } catch (error) {
    return failed(error);
  }
}

export async function getAdminData() {
  await requireAdmin();
  const [users, activeMessages, deletedMessages] = await Promise.all([
    db.select().from(user),
    db.select().from(message).where(isNull(message.deletedAt)),
    db.select().from(message).where(isNotNull(message.deletedAt)),
  ]);
  return { users, activeMessages, deletedMessages };
}
