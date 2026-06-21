import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  COLOURS,
  MOCK_PROJECTS,
  DEMO_ROOM_PHOTO,
  calcPaintLitres,
  calcWallArea,
} from "@/data/mock";
import type { PaintColour, PaintViewProject, ToastMessage } from "@/types";

type AppState = {
  userName: string;
  projects: PaintViewProject[];
  activeProjectId: string | null;
  scanPoints: { x: number; y: number }[];
  scanWall: { widthM: number; heightM: number };
  previewMode: "original" | "preview";
  toasts: ToastMessage[];
  showSettings: boolean;

  setActiveProject: (id: string | null) => void;
  getActiveProject: () => PaintViewProject | undefined;
  createFromScan: () => string;
  confirmScanWall: () => void;
  setScanPoints: (points: { x: number; y: number }[]) => void;
  setScanWallDims: (widthM: number, heightM: number) => void;
  selectColour: (colour: PaintColour, finish?: PaintColour["finish"]) => void;
  sendQuote: () => void;
  addToast: (text: string) => void;
  removeToast: (id: number) => void;
  setPreviewMode: (mode: "original" | "preview") => void;
  setShowSettings: (show: boolean) => void;
};

let toastId = 0;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: "James",
      projects: MOCK_PROJECTS,
      activeProjectId: "p1",
      scanPoints: [
        { x: 0.12, y: 0.18 },
        { x: 0.88, y: 0.18 },
        { x: 0.88, y: 0.82 },
        { x: 0.12, y: 0.82 },
      ],
      scanWall: { widthM: 3.42, heightM: 2.6 },
      previewMode: "preview",
      toasts: [],
      showSettings: false,

      setActiveProject: (id) => set({ activeProjectId: id }),

      getActiveProject: () => {
        const { projects, activeProjectId } = get();
        return projects.find((p) => p.id === activeProjectId);
      },

      createFromScan: () => {
        const { scanWall, scanPoints } = get();
        const area = calcWallArea(scanWall);
        const id = "p-" + Date.now();
        const project: PaintViewProject = {
          id,
          name: "New Room",
          roomType: "Room",
          status: "in_progress",
          updatedAt: new Date().toISOString(),
          roomPhotoUrl: DEMO_ROOM_PHOTO,
          walls: [
            {
              id: "w-" + Date.now(),
              label: "Wall 1",
              widthM: scanWall.widthM,
              heightM: scanWall.heightM,
              areaM2: area,
              points: [...scanPoints],
            },
          ],
          totalWallAreaM2: area,
          paintNeededLitres: calcPaintLitres(area),
          coats: 2,
          quote: {
            materials: Math.round(calcPaintLitres(area) * 6.5),
            labour: 280,
            other: 76,
            vatIncluded: true,
            total: 0,
          },
          quoteRef: "Q-" + Math.floor(1000 + Math.random() * 9000),
          clientName: "Client",
          decoratorName: "Parker Decorators",
        };
        project.quote!.total =
          project.quote!.materials + project.quote!.labour + project.quote!.other;
        set((s) => ({
          projects: [project, ...s.projects],
          activeProjectId: id,
        }));
        return id;
      },

      confirmScanWall: () => {
        get().addToast("Wall measurement saved.");
      },

      setScanPoints: (points) => set({ scanPoints: points }),
      setScanWallDims: (widthM, heightM) => set({ scanWall: { widthM, heightM } }),

      selectColour: (colour, finish) => {
        const { activeProjectId, projects } = get();
        if (!activeProjectId) return;
        set({
          projects: projects.map((p) =>
            p.id === activeProjectId
              ? { ...p, selectedColour: { ...colour, finish: finish ?? colour.finish } }
              : p
          ),
        });
        get().addToast("Colour added to project.");
      },

      sendQuote: () => {
        const { activeProjectId, projects } = get();
        if (!activeProjectId) return;
        set({
          projects: projects.map((p) =>
            p.id === activeProjectId ? { ...p, status: "quote_sent" as const } : p
          ),
        });
        get().addToast("Quote saved as draft.");
      },

      addToast: (text) => {
        const id = ++toastId;
        set((s) => ({ toasts: [...s.toasts, { id, text }] }));
        setTimeout(() => get().removeToast(id), 2800);
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      setPreviewMode: (previewMode) => set({ previewMode }),
      setShowSettings: (showSettings) => set({ showSettings }),
    }),
    { name: "paintview-mobile-v2" }
  )
);

export { COLOURS, DEMO_ROOM_PHOTO };
