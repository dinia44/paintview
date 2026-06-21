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
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border-light bg-white/95 px-2 py-2 backdrop-blur-md lg:hidden"
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
                  "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition",
                  active
                    ? "text-purple"
                    : "text-slate-500 hover:text-purple"
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
