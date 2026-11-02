"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navigation, siteConfig } from "@/lib/site-config";

export default function Footer({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="border-border border-t bg-muted/20 py-16 pb-6">
      <div className="mx-auto w-[min(1160px,calc(100%-2rem))]">
        <div className="flex justify-between gap-10 max-md:flex-col max-md:items-start">
          <div>
            <Link
              href="/"
              className="text-[1.35rem] font-extrabold tracking-[-.08em]"
            >
              SS<span className="text-primary">.me</span>
            </Link>
            <p className="mt-5 max-w-[310px] text-sm leading-6 text-muted-foreground">
              {siteConfig.positioning}
            </p>
          </div>
          <div className="flex items-center gap-6 whitespace-nowrap text-xs text-muted-foreground max-md:flex-wrap max-md:gap-x-5 max-md:gap-y-3">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <a
              className="inline-flex items-center gap-2"
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
            >
              <span>GitHub</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-14 flex justify-between border-border border-t pt-4 font-mono text-[.68rem] text-muted-foreground max-md:flex-col max-md:gap-2">
          <span>© {new Date().getFullYear()} Sudharshan S</span>
          <div className="flex items-center gap-5 max-md:flex-col max-md:items-start max-md:gap-3">
            <span>Built with care in India</span>
            {children}
          </div>
        </div>
      </div>
    </footer>
  );
}
