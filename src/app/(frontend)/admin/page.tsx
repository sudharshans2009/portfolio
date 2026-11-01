import { redirect } from "next/navigation";
import { generateMetadata } from "@/lib/metadata";
import { getAdminSession } from "@/lib/admin";
import { getAdminData } from "./actions";
import { getAdminProjects } from "@/lib/managed-projects";
import AdminPanel from "./admin-panel";

export const metadata = generateMetadata(
  "Admin — SS.me",
  "Manage SS.me users, messages, and projects.",
  "/admin",
);

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/user/sign-in");

  const [{ users, activeMessages, deletedMessages }, projects] = await Promise.all([
    getAdminData(),
    getAdminProjects(),
  ]);

  return (
    <main className="mx-auto min-h-[760px] w-full max-w-[1160px] px-4 py-28 max-md:py-20">
      <header className="mb-12">
        <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">Admin workspace</p>
        <h1 className="mt-7 text-[clamp(3rem,8vw,7rem)] font-medium leading-[.95] tracking-[-.09em]">
          Keep things <em className="font-semibold not-italic text-primary">useful.</em>
        </h1>
      </header>
      <AdminPanel users={users} activeMessages={activeMessages} deletedMessages={deletedMessages} projects={projects} />
    </main>
  );
}
