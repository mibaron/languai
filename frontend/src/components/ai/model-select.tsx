"use client";

import { ChevronDown, Cpu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ModelSelectProps } from "./types";

export function ModelSelect({ models, value, onChange, promptsRemaining }: ModelSelectProps) {
  const selected = models.find((m) => m.model_id === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="w-full justify-between gap-2" />
        }
      >
        <span className="flex items-center gap-2 truncate">
          <Cpu className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{selected?.name ?? "Select model"}</span>
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {promptsRemaining !== null && (
            <span className="text-xs text-muted-foreground">
              ~{promptsRemaining} prompts left
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Choose a model</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            {models.map((m) => (
              <DropdownMenuRadioItem key={m.model_id} value={m.model_id}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm">
                    {m.name}
                    {m.is_default && (
                      <span className="ml-1.5 text-xs text-muted-foreground">(default)</span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{m.provider}</span>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
