"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useProjectStore } from "@/store/project-store";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export function ProjectForm() {
  const router = useRouter();
  const { project, hydrated, hydrate, createProject, updateProject } =
    useProjectStore();
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    address: "",
    decoratorName: "",
    quoteExpiry: "",
    notes: "",
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (project) {
      setForm({
        clientName: project.clientName,
        clientEmail: project.clientEmail ?? "",
        clientPhone: project.clientPhone ?? "",
        address: project.address ?? "",
        decoratorName: project.decoratorName ?? "",
        quoteExpiry: project.quoteExpiry ?? "",
        notes: project.notes ?? "",
      });
    }
  }, [project]);

  if (!hydrated) return null;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const save = (redirect?: string) => {
    if (!form.clientName.trim()) {
      alert("Please enter a client name.");
      return;
    }
    if (project) {
      updateProject(form);
    } else {
      createProject(form);
    }
    if (redirect) router.push(redirect);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    save("/capture");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Client details</h2>
        <div>
          <Label htmlFor="clientName">Client name *</Label>
          <Input
            id="clientName"
            value={form.clientName}
            onChange={(e) => handleChange("clientName", e.target.value)}
            placeholder="e.g. Sarah Mitchell"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="clientEmail">Client email</Label>
            <Input
              id="clientEmail"
              type="email"
              value={form.clientEmail}
              onChange={(e) => handleChange("clientEmail", e.target.value)}
              placeholder="sarah@email.com"
            />
          </div>
          <div>
            <Label htmlFor="clientPhone">Client phone</Label>
            <Input
              id="clientPhone"
              type="tel"
              value={form.clientPhone}
              onChange={(e) => handleChange("clientPhone", e.target.value)}
              placeholder="07..."
            />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Project address</Label>
          <Input
            id="address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="12 Oak Street, London"
          />
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Quote details</h2>
        <div>
          <Label htmlFor="decoratorName">Decorator / company name</Label>
          <Input
            id="decoratorName"
            value={form.decoratorName}
            onChange={(e) => handleChange("decoratorName", e.target.value)}
            placeholder="Your business name"
          />
        </div>
        <div>
          <Label htmlFor="quoteExpiry">Quote expiry date</Label>
          <Input
            id="quoteExpiry"
            type="date"
            value={form.quoteExpiry}
            onChange={(e) => handleChange("quoteExpiry", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Access details, special requests..."
            className="min-h-24 w-full rounded-xl border border-border-light bg-white px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/40"
          />
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg">
          Continue to Room Capture
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => save()}
        >
          Save Draft
        </Button>
      </div>
    </form>
  );
}
