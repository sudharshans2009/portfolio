import { Github, Mail } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { generateMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { auth } from "@/lib/auth";
import ContactForm from "./contact-form";

export const metadata = generateMetadata(
  "Contact Sudharshan S",
  "Contact Sudharshan about coding projects, ideas, and collaborations.",
  "/contact",
);

export default async function ContactPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/user/sign-in");

  return (
    <main className="mx-auto min-h-[720px] w-[min(1160px,calc(100%-2rem))] py-28 max-md:min-h-[650px] max-md:py-20">
      <section className="max-w-[760px]">
        <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">A good place to start</p>
        <h1 className="my-7 text-[clamp(3.5rem,9vw,8rem)] font-medium leading-[.95] tracking-[-.09em]">Let&apos;s make something <em className="font-semibold not-italic text-primary">useful.</em></h1>
        <p className="max-w-[440px] text-[1.05rem] leading-6 text-muted-foreground">
          I&apos;m always interested in thoughtful collaborations, open-source
          ideas, coding projects, or just want to say hello.
        </p>
      </section>
      <section className="mt-[100px] border-border border-t max-md:mt-[70px]" aria-labelledby="contact-options-heading">
        <h2 id="contact-options-heading" className="sr-only">Contact options</h2>
        <div className="flex items-center justify-between gap-5 border-border border-b py-6 text-[.95rem] max-md:flex-col max-md:items-start">
          <span className="inline-flex items-center gap-2"><Mail size={20} aria-hidden="true" /> Send a message</span>
          <span className="font-mono text-xs text-muted-foreground">Stored securely in the project inbox</span>
        </div>
        <ContactForm
          name={session.user.name.trim() || session.user.email}
          email={session.user.email}
        />
        <a className="flex items-center justify-between gap-5 border-border border-b py-6 text-[.95rem] max-md:flex-col max-md:items-start" href={siteConfig.github} target="_blank" rel="noreferrer">
          <span className="inline-flex items-center gap-2"><Github size={20} aria-hidden="true" /> GitHub</span>
          <span className="font-mono text-xs text-muted-foreground">@sudharshans2009</span>
        </a>
      </section>
      <p className="mt-7 flex items-center gap-2 font-mono text-[.72rem] text-muted-foreground">Your account details are filled in for convenience.</p>
    </main>
  );
}
