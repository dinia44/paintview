"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { isValidHex, normalizeHex, starterColours } from "@/lib/colours";
import type { PaintColour } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, Heart } from "lucide-react";
import { useState } from "react";

type ColourPickerProps = {
  selected: PaintColour | null;
  onSelect: (colour: PaintColour) => void;
};

export function ColourPicker({ selected, onSelect }: ColourPickerProps) {
  const [custom, setCustom] = useState<PaintColour>({
    name: "",
    hex: "#A8B5A0",
    brand: "",
    code: "",
    finish: "Matt",
  });

  const applyCustom = () => {
    if (!custom.name.trim()) {
      alert("Please enter a colour name.");
      return;
    }
    const hex = normalizeHex(custom.hex);
    if (!isValidHex(hex)) {
      alert("Please enter a valid hex colour code.");
      return;
    }
    onSelect({ ...custom, hex });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Popular colours</Label>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {starterColours.map((colour) => {
            const isSelected = selected?.code === colour.code;
            return (
              <button
                key={colour.code}
                type="button"
                onClick={() => onSelect(colour)}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-2 p-4 text-left transition",
                  isSelected
                    ? "border-purple ring-2 ring-purple/30"
                    : "border-border-light hover:border-purple/40"
                )}
                aria-label={`Select ${colour.name}, code ${colour.code}`}
              >
                <div
                  className="mb-3 h-16 w-full rounded-xl"
                  style={{ backgroundColor: colour.hex }}
                />
                <p className="font-semibold text-text-dark">{colour.name}</p>
                <p className="text-xs text-slate-500">{colour.code}</p>
                {isSelected && (
                  <Check
                    className="absolute right-3 top-3 h-5 w-5 text-purple"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-purple" />
          <h3 className="font-semibold">Custom colour</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="colourName">Colour name</Label>
            <Input
              id="colourName"
              value={custom.name}
              onChange={(e) => setCustom({ ...custom, name: e.target.value })}
              placeholder="Sage Green"
            />
          </div>
          <div>
            <Label htmlFor="colourHex">Hex code</Label>
            <Input
              id="colourHex"
              value={custom.hex}
              onChange={(e) => setCustom({ ...custom, hex: e.target.value })}
              placeholder="#A8B5A0"
            />
          </div>
          <div>
            <Label htmlFor="colourBrand">Brand</Label>
            <Input
              id="colourBrand"
              value={custom.brand}
              onChange={(e) => setCustom({ ...custom, brand: e.target.value })}
              placeholder="Dulux, Farrow & Ball..."
            />
          </div>
          <div>
            <Label htmlFor="colourCode">Paint code</Label>
            <Input
              id="colourCode"
              value={custom.code}
              onChange={(e) => setCustom({ ...custom, code: e.target.value })}
              placeholder="e.g. 90GY 12/150"
            />
          </div>
          <div>
            <Label htmlFor="colourFinish">Finish</Label>
            <Input
              id="colourFinish"
              value={custom.finish}
              onChange={(e) => setCustom({ ...custom, finish: e.target.value })}
              placeholder="Matt, Eggshell..."
            />
          </div>
        </div>
        <button
          type="button"
          onClick={applyCustom}
          className="text-sm font-medium text-purple hover:underline"
        >
          Apply custom colour
        </button>
      </Card>
    </div>
  );
}
