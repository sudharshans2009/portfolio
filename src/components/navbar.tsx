"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navigation, siteConfig } from "@/lib/site-config";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="border-border border-b bg-background">
      <div className="mx-auto grid min-h-20 w-[min(1160px,calc(100%-2rem))] grid-cols-3 items-center max-md:grid-cols-[1fr_auto] max-md:gap-4">
        <Link href="/" className="text-[1.35rem] font-extrabold tracking-[-.08em]" aria-label="SS.me home">
          SS<span className="text-primary">.me</span>
        </Link>
        <div className="flex justify-center max-md:col-span-full max-md:row-start-2 max-md:justify-start max-md:overflow-x-auto max-md:pb-3">
          <nav aria-label="Primary navigation" className="flex items-center justify-center gap-[clamp(14px,2vw,28px)] whitespace-nowrap">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ))}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>GitHub</span>
              <ArrowUpRight className="shrink-0" size={15} aria-hidden="true" />
            </a>
          </nav>
        </div>
        <div className="flex justify-end">
          <Link href={session?.user ? "/profile" : "/user/sign-in"} className={buttonVariants({ variant: "outline", size: "sm", className: "login-link" })}>
            {isPending ? "Login" : session?.user ? "Profile" : "Login"}
          </Link>
        </div>
      </div>
    </header>
  );
}
