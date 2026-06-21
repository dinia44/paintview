"use client";

import { cn } from "@/lib/utils";
import {
  Camera,
  FolderKanban,
  Palette,
  Quote,
  Shapes,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/project/new", label: "Project", icon: FolderKanban },
  { href: "/capture", label: "Capture", icon: Camera },
  { href: "/mark-walls", label: "Walls", icon: Shapes },
  { href: "/colour", label: "Colour", icon: Palette },
  { href: "/quote", label: "Quote", icon: Quote },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mobile-nav fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/90 px-2 py-2 backdrop-blur-[16px] lg:hidden"
      aria-label="Main navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-button px-2 py-2 text-xs font-medium transition",
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-text-muted hover:text-primary"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
