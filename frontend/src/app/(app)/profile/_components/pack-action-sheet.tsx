"use client";

import { CircleCheck, Archive, X } from "lucide-react";

import { BottomDrawer } from "@/components/composites/bottom-drawer";

import type { PackActionSheetProps } from "./types";

export function PackActionSheet({
  subscription,
  onClose,
  onArchive,
  onUnsubscribe,
}: PackActionSheetProps) {
  if (!subscription) return null;

  const actions = [
    {
      icon: CircleCheck,
      label: "Mark as Complete",
      color: "text-foreground",
      onClick: onClose,
    },
    {
      icon: Archive,
      label: "Archive Pack",
      color: "text-foreground",
      onClick: () => {
        onArchive(subscription.pack.id);
        onClose();
      },
    },
    {
      icon: X,
      label: "Unsubscribe",
      color: "text-red-500",
      onClick: () => {
        onUnsubscribe(subscription.pack.id);
        onClose();
      },
    },
  ];

  return (
    <BottomDrawer open={true} onClose={onClose}>
      <div className="border-b border-border/50 px-5 pb-3 pt-1.5">
        <div className="text-base font-semibold text-foreground">
          {subscription.pack.title}
        </div>
        <div className="text-[13px] text-muted-foreground">
          in {subscription.pack.base_language}
        </div>
      </div>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`flex w-full items-center gap-3.5 border-t border-border/50 px-5 py-[15px] text-[15px] ${action.color}`}
          >
            <Icon size={20} />
            {action.label}
          </button>
        );
      })}
    </BottomDrawer>
  );
}
