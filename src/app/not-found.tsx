import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[760px] w-[min(1160px,calc(100%-2rem))] flex-col justify-center py-28 max-md:py-20">
      <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">404 - Page not found</p>
      <h1 className="my-7 mb-11 text-[clamp(4rem,11vw,9.5rem)] font-medium leading-[.95] tracking-[-.09em]">
        This page
        <br />
        <em className="font-semibold not-italic text-primary">wandered off.</em>
      </h1>
      <div className="flex items-end justify-between gap-8 border-border border-t pt-6 max-md:flex-col max-md:items-start">
        <p className="m-0 max-w-[440px] text-[1.05rem] leading-6 text-muted-foreground">
          The link may be outdated, or the page may never have existed. Let&apos;s
          get you back to the useful stuff.
        </p>
        <Link className="inline-flex items-center gap-2 bg-primary px-5 py-4 text-sm font-bold text-primary-foreground" href="/">
          Back to home <ArrowUpRight size={20} aria-hidden="true" />
        </Link>
      </div>
      <p className="mt-[100px] font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">
        {siteConfig.name} · {siteConfig.location}
      </p>
    </main>
  );
}
