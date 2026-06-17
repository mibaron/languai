"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthMeRetrieve } from "@/lib/api/orval/api/generated/auth/auth";
import {
  usePacksSubscriptionsList,
  usePacksSubscribeCreate,
  usePacksArchiveCreate,
  usePacksUnsubscribeDestroy,
  getPacksSubscriptionsListQueryKey,
} from "@/lib/api/orval/api/generated/packs/packs";
import { setUserToken } from "@/lib/utils/auth/cookie-utils";
import type { UserPackSubscription } from "@/lib/api/orval/api/generated/model";

export function useProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [exploreOpen, setExploreOpen] = useState(false);
  const [actionSheetPack, setActionSheetPack] =
    useState<UserPackSubscription | null>(null);

  const { data: user } = useAuthMeRetrieve();
  const { data: subscriptions } = usePacksSubscriptionsList({
    status: "active",
  });

  const subscribeMutation = usePacksSubscribeCreate();
  const archiveMutation = usePacksArchiveCreate();
  const unsubscribeMutation = usePacksUnsubscribeDestroy();

  const subscribedPackIds = useMemo(
    () => (subscriptions ?? []).map((s) => s.pack.id),
    [subscriptions],
  );

  const invalidateSubscriptions = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: getPacksSubscriptionsListQueryKey(),
    });
  }, [queryClient]);

  const handleSubscribe = useCallback(
    (packId: string) => {
      if (subscribedPackIds.includes(packId)) return;
      subscribeMutation.mutate(
        { data: { pack_id: packId } },
        { onSuccess: invalidateSubscriptions },
      );
    },
    [subscribedPackIds, subscribeMutation, invalidateSubscriptions],
  );

  const handleArchive = useCallback(
    (packId: string) => {
      archiveMutation.mutate(
        { packId },
        { onSuccess: invalidateSubscriptions },
      );
    },
    [archiveMutation, invalidateSubscriptions],
  );

  const handleUnsubscribe = useCallback(
    (packId: string) => {
      unsubscribeMutation.mutate(
        { packId },
        { onSuccess: invalidateSubscriptions },
      );
    },
    [unsubscribeMutation, invalidateSubscriptions],
  );

  const handleSignOut = useCallback(() => {
    setUserToken();
    router.push("/login");
  }, [router]);

  return {
    user,
    subscriptions: subscriptions ?? [],
    subscribedPackIds,
    exploreOpen,
    setExploreOpen,
    actionSheetPack,
    setActionSheetPack,
    handleSubscribe,
    handleArchive,
    handleUnsubscribe,
    handleSignOut,
  };
}
