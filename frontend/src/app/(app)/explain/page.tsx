import { Lightbulb } from "lucide-react";

import { EmptyState } from "@/components/composites/empty-state";

export default function ExplainPage() {
  return (
    <EmptyState
      icon={<Lightbulb size={28} className="text-brand" />}
      title="Explain"
      description="Ask AI to explain any grammar rule, word, or concept — in your native language."
      badge="Coming soon"
    />
  );
}
