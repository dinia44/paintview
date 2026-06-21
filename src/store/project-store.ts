"use client";

import { create } from "zustand";
import {
  defaultQuoteSettings,
  loadProject,
  loadQuoteSettings,
  saveProject,
  saveQuoteSettings,
} from "@/lib/storage";
import type {
  PaintColour,
  Project,
  QuoteSettings,
  Room,
  Wall,
} from "@/lib/types";
import { generateId } from "@/lib/utils";

type ProjectStore = {
  hydrated: boolean;
  project: Project | null;
  quoteSettings: QuoteSettings;
  currentRoomId: string | null;
  currentWallId: string | null;
  colourPreviewOpacity: number;
  showColourPreview: boolean;
  hydrate: () => void;
  createProject: (data: Partial<Project>) => void;
  updateProject: (data: Partial<Project>) => void;
  clearAll: () => void;
  setCurrentRoom: (roomId: string | null) => void;
  setCurrentWall: (wallId: string | null) => void;
  addRoom: (name: string, imageUrl?: string) => Room;
  updateRoom: (roomId: string, data: Partial<Room>) => void;
  removeRoom: (roomId: string) => void;
  addWall: (roomId: string, wall: Omit<Wall, "id" | "roomId">) => Wall;
  updateWall: (roomId: string, wallId: string, data: Partial<Wall>) => void;
  removeWall: (roomId: string, wallId: string) => void;
  applyColourToWalls: (colour: PaintColour) => void;
  updateQuoteSettings: (data: Partial<QuoteSettings>) => void;
  setColourPreviewOpacity: (opacity: number) => void;
  setShowColourPreview: (show: boolean) => void;
  persist: () => void;
};

function touchProject(project: Project): Project {
  return { ...project, updatedAt: new Date().toISOString() };
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  hydrated: false,
  project: null,
  quoteSettings: defaultQuoteSettings,
  currentRoomId: null,
  currentWallId: null,
  colourPreviewOpacity: 0.65,
  showColourPreview: true,

  hydrate: () => {
    const project = loadProject();
    const quoteSettings = loadQuoteSettings() ?? defaultQuoteSettings;
    set({
      hydrated: true,
      project,
      quoteSettings,
      currentRoomId: project?.rooms[0]?.id ?? null,
    });
  },

  createProject: (data) => {
    const now = new Date().toISOString();
    const project: Project = {
      id: generateId(),
      clientName: data.clientName ?? "",
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      address: data.address,
      decoratorName: data.decoratorName,
      quoteExpiry: data.quoteExpiry,
      rooms: data.rooms ?? [],
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };
    set({ project });
    get().persist();
  },

  updateProject: (data) => {
    const { project } = get();
    if (!project) return;
    const updated = touchProject({ ...project, ...data });
    set({ project: updated });
    get().persist();
  },

  clearAll: () => {
    set({
      project: null,
      currentRoomId: null,
      currentWallId: null,
      quoteSettings: defaultQuoteSettings,
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("paintview_project");
      localStorage.removeItem("paintview_quote_settings");
    }
  },

  setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),

  setCurrentWall: (wallId) => set({ currentWallId: wallId }),

  addRoom: (name, imageUrl) => {
    const { project } = get();
    if (!project) throw new Error("No project");
    const room: Room = {
      id: generateId(),
      name,
      imageUrl,
      walls: [],
      ceilingIncluded: false,
      ceilingAreaM2: 0,
    };
    const updated = touchProject({
      ...project,
      rooms: [...project.rooms, room],
    });
    set({ project: updated, currentRoomId: room.id });
    get().persist();
    return room;
  },

  updateRoom: (roomId, data) => {
    const { project } = get();
    if (!project) return;
    const rooms = project.rooms.map((r) =>
      r.id === roomId ? { ...r, ...data } : r
    );
    set({ project: touchProject({ ...project, rooms }) });
    get().persist();
  },

  removeRoom: (roomId) => {
    const { project, currentRoomId } = get();
    if (!project) return;
    const rooms = project.rooms.filter((r) => r.id !== roomId);
    set({
      project: touchProject({ ...project, rooms }),
      currentRoomId: currentRoomId === roomId ? rooms[0]?.id ?? null : currentRoomId,
    });
    get().persist();
  },

  addWall: (roomId, wallData) => {
    const { project } = get();
    if (!project) throw new Error("No project");
    const wall: Wall = {
      id: generateId(),
      roomId,
      ...wallData,
    };
    const rooms = project.rooms.map((r) =>
      r.id === roomId ? { ...r, walls: [...r.walls, wall] } : r
    );
    set({
      project: touchProject({ ...project, rooms }),
      currentWallId: wall.id,
    });
    get().persist();
    return wall;
  },

  updateWall: (roomId, wallId, data) => {
    const { project } = get();
    if (!project) return;
    const rooms = project.rooms.map((r) =>
      r.id === roomId
        ? {
            ...r,
            walls: r.walls.map((w) =>
              w.id === wallId ? { ...w, ...data } : w
            ),
          }
        : r
    );
    set({ project: touchProject({ ...project, rooms }) });
    get().persist();
  },

  removeWall: (roomId, wallId) => {
    const { project, currentWallId } = get();
    if (!project) return;
    const rooms = project.rooms.map((r) =>
      r.id === roomId
        ? { ...r, walls: r.walls.filter((w) => w.id !== wallId) }
        : r
    );
    set({
      project: touchProject({ ...project, rooms }),
      currentWallId: currentWallId === wallId ? null : currentWallId,
    });
    get().persist();
  },

  applyColourToWalls: (colour) => {
    const { project } = get();
    if (!project) return;
    const rooms = project.rooms.map((r) => ({
      ...r,
      walls: r.walls.map((w) => ({ ...w, colour })),
    }));
    set({ project: touchProject({ ...project, rooms }) });
    get().persist();
  },

  updateQuoteSettings: (data) => {
    const quoteSettings = { ...get().quoteSettings, ...data };
    set({ quoteSettings });
    saveQuoteSettings(quoteSettings);
  },

  setColourPreviewOpacity: (opacity) => set({ colourPreviewOpacity: opacity }),

  setShowColourPreview: (show) => set({ showColourPreview: show }),

  persist: () => {
    const { project, quoteSettings } = get();
    if (project) saveProject(project);
    saveQuoteSettings(quoteSettings);
  },
}));
