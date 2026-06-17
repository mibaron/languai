"use client";

import { useState } from "react";
import { ArrowLeft, Search, X, Plus, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePacksList } from "@/lib/api/orval/api/generated/packs/packs";

import type { ExplorePacksViewProps } from "./types";

export function ExplorePacksView({
  open,
  subscribedPackIds,
  onSubscribe,
  onClose,
}: ExplorePacksViewProps) {
  const [query, setQuery] = useState("");
  const { data: packsData } = usePacksList();
  const allPacks = packsData?.results ?? [];

  const filtered = allPacks.filter(
    (p) =>
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.base_language.toLowerCase().includes(query.toLowerCase()),
  );

  const featured = allPacks.slice(0, 3);

  return (
    <div
      className={cn(
        "absolute inset-0 z-40 flex flex-col bg-background transition-transform duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        open ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex h-[52px] shrink-0 items-center gap-2.5 border-b border-border/50 px-4">
        <button
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-base font-semibold tracking-[-0.01em] text-foreground">
          Browse Packs
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-3">
          <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-muted px-3.5 py-2.5">
            <Search size={16} className="text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search packs..."
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>

          {!query && (
            <>
              <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">
                Featured
              </div>
              <div className="-mx-4 mb-5 flex gap-2.5 overflow-x-auto px-4 pb-1">
                {featured.map((pack) => {
                  const isSubscribed = subscribedPackIds.includes(pack.id);
                  return (
                    <div
                      key={pack.id}
                      className="w-[172px] shrink-0 rounded-[14px] border border-border bg-card p-3.5"
                    >
                      <span className="mb-2 inline-block rounded-full bg-brand-muted px-[7px] py-0.5 text-[10px] font-bold text-brand">
                        {pack.level_code}
                      </span>
                      <div className="mb-px text-sm font-semibold text-foreground">
                        {pack.title}
                      </div>
                      <div className="mb-3 text-xs text-muted-foreground">
                        in {pack.base_language}
                      </div>
                      <button
                        onClick={() => onSubscribe(pack.id)}
                        className={cn(
                          "w-full rounded-lg py-2 text-xs font-semibold",
                          isSubscribed
                            ? "bg-muted text-muted-foreground"
                            : "bg-brand text-white",
                        )}
                      >
                        {isSubscribed ? "✓ Added" : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">
                All Packs
              </div>
            </>
          )}

          <div className="flex flex-col gap-2.5 pb-4">
            {filtered.map((pack) => {
              const isSubscribed = subscribedPackIds.includes(pack.id);
              return (
                <div
                  key={pack.id}
                  className={cn(
                    "rounded-2xl border-[1.5px] p-4",
                    isSubscribed
                      ? "border-brand/30"
                      : "border-border",
                  )}
                >
                  <div className="mb-2.5 flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0 rounded-full bg-brand-muted px-2 py-[3px] text-[10px] font-bold text-brand">
                      {pack.level_code}
                    </span>
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold text-foreground">
                        {pack.title}
                      </div>
                      <div className="mt-px text-xs text-muted-foreground">
                        Explanations in {pack.base_language}
                      </div>
                    </div>
                    {isSubscribed && (
                      <CircleCheck size={20} className="text-brand" />
                    )}
                  </div>
                  <p className="mb-2.5 text-[13px] leading-relaxed text-muted-foreground">
                    {pack.description}
                  </p>
                  <div className="mb-3.5 flex flex-wrap gap-1.5">
                    {[
                      `${pack.grammar_count} grammar`,
                      `${pack.vocab_count} vocab`,
                      `${pack.exercise_count} exercises`,
                    ].map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-muted px-2 py-[3px] text-[11px] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onSubscribe(pack.id)}
                    className={cn(
                      "flex w-full items-center justify-center gap-1.5 rounded-[10px] py-2.5 text-sm font-semibold",
                      isSubscribed
                        ? "border-[1.5px] border-border bg-transparent text-muted-foreground"
                        : "bg-brand text-white",
                    )}
                  >
                    {isSubscribed ? (
                      "Subscribed"
                    ) : (
                      <>
                        <Plus size={14} />
                        Add Pack
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
