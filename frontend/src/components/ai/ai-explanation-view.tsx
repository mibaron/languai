import type { AIExplanationViewProps } from "./types";

export function AIExplanationView({ data }: AIExplanationViewProps) {
  return (
    <div className="space-y-4">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {data.explanation}
        </p>
      </div>

      {data.key_points.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Key Points</h4>
          <ul className="space-y-1">
            {data.key_points.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-primary">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.common_mistakes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Common Mistakes</h4>
          <ul className="space-y-1">
            {data.common_mistakes.map((mistake, i) => (
              <li key={i} className="flex gap-2 text-sm text-red-500 dark:text-red-400">
                <span>✗</span>
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
