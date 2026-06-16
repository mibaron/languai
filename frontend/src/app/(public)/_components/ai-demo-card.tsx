function TypingDots() {
  return (
    <div className="mt-2 flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1 animate-bounce rounded-full bg-zinc-600"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

export function AiDemoCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0f]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-[18px] py-3.5">
        <span className="size-2 rounded-full bg-red-500" />
        <span className="size-2 rounded-full bg-amber-500" />
        <span className="size-2 rounded-full bg-green-500" />
        <span className="ml-1 text-xs font-medium text-zinc-600">
          AI Practice Generator
        </span>
      </div>

      <div className="p-[18px] pt-5">
        <div className="mb-3.5 rounded-[10px] border border-brand/20 bg-brand/[0.12] p-3.5">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-brand-light">
            You asked
          </div>
          <div className="text-[13px] leading-snug text-zinc-300">
            Generate 3 example sentences using &quot;weil&quot; (because) with
            modal verbs at A2 level
          </div>
        </div>

        <div className="rounded-[10px] bg-white/[0.04] p-3.5">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-zinc-600">
            LinguAI AI
          </div>
          <div className="text-[13px] leading-relaxed text-zinc-400">
            Here are 3 examples with{" "}
            <span className="text-brand-light">weil</span> + modal verbs:
            <br />
            <br />
            1.{" "}
            <strong className="text-zinc-300">
              Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.
            </strong>
            <br />
            <span className="text-xs text-zinc-600">
              I&apos;m learning German because I want to work in Germany.
            </span>
            <br />
            <br />
            2.{" "}
            <strong className="text-zinc-300">
              Sie bleibt zu Hause, weil sie schlafen muss.
            </strong>
            <br />
            <span className="text-xs text-zinc-600">
              She stays home because she has to sleep.
            </span>
            <br />
            <br />
            3.{" "}
            <strong className="text-zinc-300">
              Er kauft das Buch, weil er lesen kann.
            </strong>
          </div>
          <TypingDots />
        </div>
      </div>
    </div>
  );
}
