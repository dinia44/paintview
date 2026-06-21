import { DEMO_ROOM_PHOTO, formatGbp } from "@/data/mock";
import { PrimaryButton, ScreenHeader, SecondaryButton, ToastStack } from "@/components/ui";
import { useAppStore } from "@/store/appStore";
import { Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export function QuoteScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, sendQuote, addToast } = useAppStore();
  const project = projects.find((p) => p.id === id) ?? projects[0];
  if (!project?.quote) return null;

  const q = project.quote;
  const colour = project.selectedColour;
  const date = new Date(project.updatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleShare = async () => {
    const text = `PaintView Quote — ${project.name}\nTotal: ${formatGbp(q.total)} inc. VAT`;
    if (navigator.share) {
      await navigator.share({ title: "PaintView Quote", text });
    } else {
      await navigator.clipboard.writeText(text);
      addToast("Client quote link copied.");
    }
  };

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-pv-bg pb-8">
      <ScreenHeader
        title="Quote Summary"
        onBack={() => navigate(`/colour/${project.id}`)}
        right={
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 rounded-full bg-pv-lavender px-3 py-2 text-sm font-semibold text-pv-purple-dark"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
        }
      />

      <div className="mx-4 rounded-[26px] border border-pv-border bg-pv-surface p-5 shadow-pv">
        <p className="text-sm font-semibold text-pv-purple">{project.roomType}</p>
        <p className="mt-1 text-sm text-pv-muted">
          {date} · Quote #{project.quoteRef}
        </p>
        <img
          src={project.roomPhotoUrl ?? DEMO_ROOM_PHOTO}
          alt=""
          className="mt-4 aspect-video w-full rounded-2xl object-cover"
        />
        <p className="mt-5 text-sm text-pv-muted">Total Estimate</p>
        <p className="text-3xl font-extrabold tracking-tight">
          {formatGbp(q.total)} <span className="text-base font-semibold text-pv-muted">inc. VAT</span>
        </p>
        <dl className="mt-5 space-y-2 border-t border-pv-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-pv-muted">Materials</dt>
            <dd className="font-semibold">{formatGbp(q.materials)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-pv-muted">Labour</dt>
            <dd className="font-semibold">{formatGbp(q.labour)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-pv-muted">Other</dt>
            <dd className="font-semibold">{formatGbp(q.other)}</dd>
          </div>
        </dl>
      </div>

      {colour && (
        <div className="mx-4 mt-4 flex items-center gap-3 rounded-[20px] border border-pv-border bg-pv-sage-soft p-4">
          <span
            className="h-12 w-12 rounded-full border border-pv-border"
            style={{ backgroundColor: colour.hex }}
          />
          <div>
            <p className="font-bold">{colour.name}</p>
            <p className="text-sm text-pv-muted">
              {colour.brand} {colour.code} · Finish: {colour.finish}
            </p>
          </div>
        </div>
      )}

      <div className="mx-4 mt-4 rounded-[22px] border border-dashed border-pv-border bg-pv-surface-soft p-4">
        <p className="font-bold">Client Preview</p>
        <p className="mt-1 text-sm text-pv-muted">
          This is how your quote will appear to your client.
        </p>
        <button
          type="button"
          onClick={() => navigate(`/client-preview/${project.id}`)}
          className="mt-3 w-full rounded-2xl border border-pv-border bg-pv-surface p-3 text-left text-sm font-semibold text-pv-purple shadow-sm"
        >
          View client preview →
        </button>
      </div>

      <div className="mx-4 mt-6 space-y-3">
        <PrimaryButton
          onClick={() => {
            sendQuote();
            addToast("Quote ready to send.");
          }}
        >
          Send Quote
        </PrimaryButton>
        <SecondaryButton onClick={() => window.print()}>Download PDF</SecondaryButton>
      </div>
      <ToastStack />
    </div>
  );
}
