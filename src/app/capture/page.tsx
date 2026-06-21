"use client";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { ImageCapture } from "@/components/ImageCapture";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/store/project-store";
import { Camera } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CapturePage() {
  const { project, hydrated, hydrate } = useProjectStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) return null;

  if (!project) {
    return (
      <AppShell title="Room Capture" subtitle="Take or upload room photos">
        <EmptyState
          icon={Camera}
          title="No project yet"
          description="Create a project first, then capture room photos for your quote."
          action={
            <Link href="/project/new">
              <Button size="lg">Create Project</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Room Capture"
      subtitle={`Project: ${project.clientName}`}
    >
      <ImageCapture />
    </AppShell>
  );
}
