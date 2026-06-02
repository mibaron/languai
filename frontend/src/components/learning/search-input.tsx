"use client";

import { Input } from "@/components/ui/input";

import type { SearchInputProps } from "./types";

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="🔍  Search / Suchen..."
      className="mb-4 border-stone-300 bg-white text-emerald-950"
    />
  );
}
