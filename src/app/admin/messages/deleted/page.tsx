import Link from "next/link";
import { redirect } from "next/navigation";
import { generateMetadata } from "@/lib/metadata";
import { getAdminSession } from "@/lib/admin";
import { getDeletedMessages } from "@/app/admin/actions";
import DeletedMessagesPanel from "@/components/deleted-messages-panel";

export const metadata = generateMetadata(
  "Deleted messages — Admin — SS.me",
  "Review and restore deleted SS.me messages.",
  "/admin/messages/deleted",
);

export default async function DeletedMessagesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/user/sign-in");

  const messages = await getDeletedMessages();

  return (
    <main className="mx-auto min-h-[760px] w-full max-w-[1160px] px-4 py-28 max-md:py-20">
      <header className="mb-12">
        <Link href="/admin" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Back to admin
        </Link>
        <p className="mt-8 font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">Admin workspace</p>
        <h1 className="mt-7 text-[clamp(3rem,8vw,7rem)] font-medium leading-[.95] tracking-[-.09em]">
          Deleted <em className="font-semibold not-italic text-primary">messages.</em>
        </h1>
      </header>
      <DeletedMessagesPanel messages={messages} />
    </main>
  );
}
