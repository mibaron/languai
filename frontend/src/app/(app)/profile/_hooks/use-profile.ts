"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useAuthMeRetrieve,
  useAuthMePartialUpdate,
  useAuthMeDestroy,
  useAuthLogoutCreate,
  getAuthMeRetrieveQueryKey,
} from "@/lib/api/orval/api/generated/auth/auth";
import {
  usePacksSubscriptionsList,
  usePacksSubscribeCreate,
  usePacksArchiveCreate,
  usePacksUnsubscribeDestroy,
  getPacksSubscriptionsListQueryKey,
} from "@/lib/api/orval/api/generated/packs/packs";
import { setUserToken } from "@/lib/utils/auth/cookie-utils";
import type { UserPackSubscription } from "@/lib/api/orval/api/generated/model";

type DrawerState =
  | { type: "none" }
  | { type: "editName" }
  | { type: "language"; mode: "speaks" | "learning" }
  | { type: "changePassword" }
  | { type: "deleteAccount" };

export function useProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [exploreOpen, setExploreOpen] = useState(false);
  const [actionSheetPack, setActionSheetPack] =
    useState<UserPackSubscription | null>(null);
  const [drawer, setDrawer] = useState<DrawerState>({ type: "none" });

  const { data: user } = useAuthMeRetrieve();
  const { data: subscriptions } = usePacksSubscriptionsList({
    status: "active",
  });

  const logoutMutation = useAuthLogoutCreate();
  const updateMeMutation = useAuthMePartialUpdate();
  const deleteMeMutation = useAuthMeDestroy();
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

  const invalidateMe = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: getAuthMeRetrieveQueryKey(),
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

  const handleSignOut = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      setUserToken();
      router.push("/login");
    }
  }, [logoutMutation, router]);

  const handleSaveName = useCallback(
    (firstName: string, lastName: string) => {
      updateMeMutation.mutate(
        { data: { first_name: firstName, last_name: lastName } },
        {
          onSuccess: () => {
            invalidateMe();
            setDrawer({ type: "none" });
          },
        },
      );
    },
    [updateMeMutation, invalidateMe],
  );

  const handleSaveLanguage = useCallback(
    (value: string) => {
      const field =
        drawer.type === "language" && drawer.mode === "speaks"
          ? "native_language"
          : "learning_language";
      updateMeMutation.mutate(
        { data: { [field]: value } },
        {
          onSuccess: () => {
            invalidateMe();
            setDrawer({ type: "none" });
          },
        },
      );
    },
    [drawer, updateMeMutation, invalidateMe],
  );

  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteMeMutation.mutateAsync();
    } finally {
      setUserToken();
      router.push("/login");
    }
  }, [deleteMeMutation, router]);

  const closeDrawer = useCallback(() => setDrawer({ type: "none" }), []);

  return {
    user,
    subscriptions: subscriptions ?? [],
    subscribedPackIds,
    exploreOpen,
    setExploreOpen,
    actionSheetPack,
    setActionSheetPack,
    drawer,
    setDrawer,
    closeDrawer,
    handleSubscribe,
    handleArchive,
    handleUnsubscribe,
    handleSignOut,
    handleSaveName,
    handleSaveLanguage,
    handleDeleteAccount,
    isUpdatingProfile: updateMeMutation.isPending,
    isDeletingAccount: deleteMeMutation.isPending,
  };
}
