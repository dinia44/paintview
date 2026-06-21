"use client";

import { Button } from "@/components/ui/Button";
import { formatQuoteText, getClientQuoteUrl } from "@/lib/quoteFormatter";
import { useProjectStore } from "@/store/project-store";
import { Check, Copy, Printer, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareActions() {
  const { project, quoteSettings } = useProjectStore();
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const quoteText = formatQuoteText(project, quoteSettings);
  const quoteUrl = getClientQuoteUrl(project.id);

  const copyQuote = async () => {
    await navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(quoteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printQuote = () => window.print();

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `PaintView Quote — ${project.clientName}`,
        text: quoteText,
        url: quoteUrl,
      });
    } else {
      await copyQuote();
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${quoteText}\n\n${quoteUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(
      `Paint Quote for ${project.clientName}`
    );
    const body = encodeURIComponent(`${quoteText}\n\nView online: ${quoteUrl}`);
    window.location.href = `mailto:${project.clientEmail || ""}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Button size="lg" onClick={shareNative}>
          <Share2 className="h-5 w-5" />
          Share Quote
        </Button>
        <Button variant="outline" size="lg" onClick={copyQuote}>
          {copied ? (
            <Check className="h-5 w-5" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
          Copy Quote
        </Button>
        <Button variant="outline" size="lg" onClick={printQuote}>
          <Printer className="h-5 w-5" />
          Print / Save PDF
        </Button>
        <Button variant="outline" size="lg" onClick={copyLink}>
          <Copy className="h-5 w-5" />
          Copy Quote Link
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="secondary" size="lg" onClick={shareWhatsApp}>
          Send via WhatsApp
        </Button>
        <Button variant="secondary" size="lg" onClick={shareEmail}>
          Send via Email
        </Button>
      </div>
    </div>
  );
}
