"use client";

import { AppShell } from "@/components/AppShell";
import { ProjectForm } from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <AppShell
      title="New Project"
      subtitle="Set up client and quote details"
    >
      <ProjectForm />
    </AppShell>
  );
}
