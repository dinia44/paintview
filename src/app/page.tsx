"use client";

import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/store/project-store";
import { motion } from "framer-motion";
import {
  Calculator,
  Camera,
  FolderKanban,
  Palette,
  Share2,
  Shapes,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const features = [
  {
    icon: Camera,
    title: "Snap & Mark Walls",
    description: "Capture room photos and outline walls with guided marking.",
  },
  {
    icon: Calculator,
    title: "Calculate Paint",
    description: "Enter confirmed dimensions and get accurate paint estimates.",
  },
  {
    icon: Palette,
    title: "Preview Colours",
    description: "Show clients how their chosen colour looks on the wall.",
  },
  {
    icon: FolderKanban,
    title: "Generate Quote",
    description: "Build professional quotes with materials, labour, and VAT.",
  },
  {
    icon: Share2,
    title: "Share with Client",
    description: "Send a polished quote link your client can view on their phone.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { hydrated, project, hydrate } = useProjectStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const continueProject = () => {
    if (!project) {
      router.push("/project/new");
      return;
    }
    if (project.rooms.length === 0) {
      router.push("/capture");
    } else if (project.rooms.every((r) => r.walls.length === 0)) {
      router.push("/mark-walls");
    } else {
      router.push("/quote");
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-text-light">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        <aside className="hidden w-80 shrink-0 flex-col justify-between border-r border-white/10 p-8 lg:flex">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple shadow-lg shadow-purple/30">
                <Shapes className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">PaintView</p>
                <p className="text-xs text-muted-light">
                  Smart Measuring. Accurate Quotes. Beautiful Results.
                </p>
              </div>
            </div>
            <ul className="space-y-5">
              {features.map((f) => (
                <li key={f.title} className="flex gap-3">
                  <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-purple-soft" />
                  <div>
                    <p className="font-medium">{f.title}</p>
                    <p className="text-sm text-muted-light">{f.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="flex flex-1 flex-col justify-center px-6 py-16 sm:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple">
                <Shapes className="h-5 w-5 text-white" />
              </div>
              <p className="text-lg font-bold">PaintView</p>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              PaintView
            </h1>
            <p className="mt-4 text-lg text-purple-soft sm:text-xl">
              Smart room capture, colour preview, and decorator quotes.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-light">
              Take room photos, mark the walls, estimate paint, preview colours,
              and build a clean quote your client can understand.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/project/new" className="flex-1">
                <Button size="lg">Start Room Quote</Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-purple-soft text-purple-soft hover:bg-purple/10"
                onClick={continueProject}
                disabled={!hydrated}
              >
                View Saved Project
              </Button>
            </div>

            {project && (
              <p className="mt-4 text-sm text-muted-light">
                Saved project for <strong className="text-white">{project.clientName}</strong> —{" "}
                {project.rooms.length} room{project.rooms.length !== 1 ? "s" : ""}
              </p>
            )}
          </motion.div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:hidden">
            {features.slice(0, 4).map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-2xl border border-white/10 bg-panel-dark p-4"
              >
                <f.icon className="mb-2 h-5 w-5 text-purple-soft" />
                <p className="font-medium">{f.title}</p>
                <p className="mt-1 text-sm text-muted-light">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
