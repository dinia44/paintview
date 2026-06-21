"use client";

import { QuotePreview } from "@/components/QuotePreview";
import { ShareActions } from "@/components/ShareActions";
import { defaultQuoteSettings } from "@/lib/storage";
import { useProjectStore } from "@/store/project-store";
import { useEffect } from "react";

export default function ClientViewPage() {
  const { project, quoteSettings, hydrated, hydrate } = useProjectStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-muted">Loading quote...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="text-2xl font-bold text-text-main">Quote not found</h1>
        <p className="mt-2 text-text-muted">
          This demo link reads from your local saved project. Create a quote on
          this device first.
        </p>
        <a href="/" className="mt-6 font-semibold text-primary hover:text-primary-dark hover:underline">
          Go to PaintView
        </a>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen py-8 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 max-w-2xl px-4">
        <ShareActions />
      </div>
      <QuotePreview
        project={project}
        quoteSettings={quoteSettings ?? defaultQuoteSettings}
      />
    </div>
  );
}
