"use client";

import { useProjectStore } from "@/store/project-store";
import { useEffect } from "react";

export function StoreHydrator() {
  const hydrate = useProjectStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
}
