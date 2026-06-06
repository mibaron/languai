"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AIContentModal } from "./ai-content-modal";
import type { AIButtonProps } from "./types";

export function AIButton({ context }: AIButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(true)}
        className="h-6 w-6 text-muted-foreground hover:text-primary"
        title="AI Assist"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </Button>
      <AIContentModal open={open} onOpenChange={setOpen} context={context} />
    </>
  );
}
