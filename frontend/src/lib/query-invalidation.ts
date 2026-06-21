import type { QueryClient } from "@tanstack/react-query";

import { getAuthMeRetrieveQueryKey } from "@/lib/api/orval/api/generated/auth/auth";
import { getExercisesAvailableTypesRetrieveQueryKey } from "@/lib/api/orval/api/generated/exercises/exercises";
import { getPacksSubscriptionsListQueryKey } from "@/lib/api/orval/api/generated/packs/packs";

function invalidatePackPages(qc: QueryClient, packId: string) {
  qc.invalidateQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      typeof query.queryKey[0] === "string" &&
      query.queryKey[0].includes(`/packs/${packId}/pages/`),
  });
}

export function onProgressChanged(qc: QueryClient, packId: string) {
  invalidatePackPages(qc, packId);
  qc.invalidateQueries({
    queryKey: getExercisesAvailableTypesRetrieveQueryKey(),
  });
}

export function onCreditChanged(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: getAuthMeRetrieveQueryKey() });
}

export function onSubscriptionChanged(qc: QueryClient) {
  qc.invalidateQueries({
    queryKey: getPacksSubscriptionsListQueryKey(),
  });
}
