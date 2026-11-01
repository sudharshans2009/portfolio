"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { navigation, siteConfig } from "@/lib/site-config";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-border border-b bg-background">
      <div className="mx-auto flex min-h-20 w-[min(1160px,calc(100%-2rem))] items-center justify-between gap-4">
        <Link href="/" className="text-[1.35rem] font-extrabold tracking-[-.08em]" aria-label="SS.me home">
          SS<span className="text-primary">.me</span>
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center justify-center gap-[clamp(14px,2vw,28px)] whitespace-nowrap max-md:hidden">
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
        <div className="flex items-center gap-2">
          <Link href={session?.user ? "/profile" : "/user/sign-in"} className={buttonVariants({ variant: "outline", size: "sm", className: "login-link" })}>
            {isPending ? "Login" : session?.user ? "Profile" : "Login"}
          </Link>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="hidden max-md:grid"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-border px-4 py-4 md:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto grid w-[min(1160px,calc(100%-2rem))] gap-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="border-b border-border py-3 text-sm font-semibold" onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 py-3 text-sm font-semibold"
            >
              <span>GitHub</span>
              <ArrowUpRight className="shrink-0" size={15} aria-hidden="true" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
