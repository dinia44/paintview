"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { MobileNav } from "./MobileNav";

type AppShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  showNav?: boolean;
  action?: ReactNode;
};

export function AppShell({
  children,
  title,
  subtitle,
  dark = false,
  showNav = true,
  action,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen",
        dark ? "bg-background-dark text-text-light" : "bg-panel-soft text-text-dark"
      )}
    >
      <div className="mx-auto flex min-h-screen max-w-6xl">
        {showNav && (
          <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-panel-dark p-6 lg:block">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple">
                <span className="text-lg font-bold text-white">PV</span>
              </div>
              <div>
                <p className="font-bold text-white">PaintView</p>
                <p className="text-xs text-muted-light">Decorator tools</p>
              </div>
            </div>
            <DesktopNav />
          </aside>
        )}

        <div className="flex min-h-screen flex-1 flex-col">
          {(title || action) && (
            <header
              className={cn(
                "sticky top-0 z-20 border-b px-4 py-4 backdrop-blur-md sm:px-6",
                dark
                  ? "border-white/10 bg-background-dark/90"
                  : "border-border-light bg-panel-soft/90"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  {title && (
                    <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
                  )}
                  {subtitle && (
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        dark ? "text-muted-light" : "text-slate-600"
                      )}
                    >
                      {subtitle}
                    </p>
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
          <aside className="hidden w-72 shrink-0 border-l border-border-light bg-white p-6 xl:block">
            <QuoteSummarySidebar />
          </aside>
        )}
      </div>
    </div>
  );
}

function DesktopNav() {
  const links = [
    { href: "/project/new", label: "Project" },
    { href: "/capture", label: "Capture" },
    { href: "/mark-walls", label: "Walls" },
    { href: "/colour", label: "Colour" },
    { href: "/quote", label: "Quote" },
  ];

  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="block rounded-lg px-3 py-2 text-sm text-muted-light transition hover:bg-white/5 hover:text-white"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

function QuoteSummarySidebar() {
  return (
    <div className="sticky top-6 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Quick summary
      </h2>
      <p className="text-sm text-slate-600">
        Complete room capture and measurements to see paint and quote totals here.
      </p>
      <a
        href="/quote"
        className="inline-flex text-sm font-medium text-purple hover:underline"
      >
        Open quote builder →
      </a>
    </div>
  );
}
