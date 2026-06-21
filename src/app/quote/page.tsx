"use client";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { QuoteBuilder } from "@/components/QuoteBuilder";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/store/project-store";
import { Quote } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function QuotePage() {
  const { project, hydrated, hydrate } = useProjectStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) return null;

  if (!project) {
    return (
      <AppShell title="Quote" subtitle="Build your professional quote">
        <EmptyState
          icon={Quote}
          title="No project yet"
          description="Start a project and add room details to build a quote."
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
      title="Quote Builder"
      subtitle={`Quote for ${project.clientName}`}
    >
      <QuoteBuilder />
    </AppShell>
  );
}
