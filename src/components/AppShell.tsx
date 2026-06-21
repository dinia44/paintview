"use client";

import { cn } from "@/lib/utils";
import { Shapes } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { MobileNav } from "./MobileNav";

type AppShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showNav?: boolean;
  action?: ReactNode;
};

const navLinks = [
  { href: "/project/new", label: "Project" },
  { href: "/capture", label: "Capture" },
  { href: "/mark-walls", label: "Walls" },
  { href: "/colour", label: "Colour" },
  { href: "/quote", label: "Quote" },
];

export function AppShell({
  children,
  title,
  subtitle,
  showNav = true,
  action,
}: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell min-h-screen text-text-main">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        {showNav && (
          <aside className="sidebar hidden w-56 shrink-0 border-r border-border bg-surface/80 p-6 backdrop-blur-[18px] lg:block">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
                <Shapes className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <div>
                <p className="font-bold text-text-main">PaintView</p>
                <p className="text-xs text-text-muted">Decorator tools</p>
              </div>
            </div>
            <nav className="space-y-1" aria-label="Desktop navigation">
              {navLinks.map((link) => {
                const active =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block rounded-button px-3 py-2.5 text-sm transition",
                      active
                        ? "bg-primary-soft font-semibold text-primary-dark"
                        : "text-text-muted hover:bg-surface-soft hover:text-text-main"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        <div className="flex min-h-screen flex-1 flex-col">
          {(title || action) && (
            <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-4 py-4 backdrop-blur-md sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {title && (
                    <h1 className="text-xl font-extrabold tracking-tight text-text-main sm:text-2xl">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
                  )}
                </div>
                {action}
              </div>
            </header>
          )}

          <main className="flex-1 px-4 py-6 pb-28 sm:px-6 lg:pb-6">
            {children}
          </main>

          {showNav && <MobileNav />}
        </div>

        {showNav && (
          <aside className="hidden w-72 shrink-0 border-l border-border bg-surface/60 p-6 backdrop-blur-sm xl:block">
            <QuoteSummarySidebar />
          </aside>
        )}
      </div>
    </div>
  );
}

function QuoteSummarySidebar() {
  return (
    <div className="sticky top-6 space-y-4">
      <h2 className="text-sm font-semibold text-text-main">Quick summary</h2>
      <p className="text-sm leading-relaxed text-text-muted">
        Complete room capture and measurements to see paint and quote totals
        here.
      </p>
      <Link
        href="/quote"
        className="inline-flex text-sm font-medium text-primary hover:text-primary-dark hover:underline"
      >
        Open quote builder →
      </Link>
    </div>
  );
}
