import { BottomNav } from "@/components/BottomNav";
import { SecondaryButton, ToastStack } from "@/components/ui";
import { useAppStore } from "@/store/appStore";
import { useState } from "react";

export function ProfileScreen() {
  const userName = useAppStore((s) => s.userName);
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-pv-bg pb-28">
      <header className="px-4 pt-[max(12px,env(safe-area-inset-top))]">
        <h1 className="text-2xl font-extrabold">Profile</h1>
      </header>
      <div className="mx-4 mt-6 rounded-[24px] border border-pv-border bg-pv-surface p-5 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pv-lavender text-2xl font-bold text-pv-purple">
          {userName.charAt(0)}
        </div>
        <p className="mt-4 text-lg font-bold">{userName}</p>
        <p className="text-pv-muted">Decorator · PaintView Pro</p>
      </div>

      <div className="mx-4 mt-4 space-y-2">
        <button type="button" className="w-full rounded-2xl border border-pv-border bg-pv-surface px-4 py-4 text-left font-semibold">
          Business details
        </button>
        <button type="button" className="w-full rounded-2xl border border-pv-border bg-pv-surface px-4 py-4 text-left font-semibold">
          Quote defaults
        </button>
        <button
          type="button"
          onClick={() => setShowAdmin(!showAdmin)}
          className="w-full rounded-2xl border border-pv-border bg-pv-surface px-4 py-4 text-left text-sm text-pv-muted"
        >
          Settings
        </button>
      </div>

      {showAdmin && (
        <div className="mx-4 mt-4 rounded-[20px] border border-pv-border bg-pv-surface-soft p-4 text-sm text-pv-muted">
          <p className="font-semibold text-pv-charcoal">Integrations (coming soon)</p>
          <p className="mt-2">Cloud sync, AI wall suggestions, and payments will live here — not in your daily workflow.</p>
        </div>
      )}

      <div className="mx-4 mt-6">
        <SecondaryButton onClick={() => localStorage.removeItem("paintview-mobile-v2")}>
          Reset local data
        </SecondaryButton>
      </div>
      <BottomNav />
      <ToastStack />
    </div>
  );
}
