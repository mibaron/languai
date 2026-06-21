"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useAiModelsList } from "@/lib/api/orval/api/generated/ai-content/ai-content";
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
} from "@/lib/api/orval/api/generated/packs/packs";
import { useProgressPacksResetCreate } from "@/lib/api/orval/api/generated/progress/progress";
import { onProgressChanged, onSubscriptionChanged } from "@/lib/query-invalidation";
import { setUserToken } from "@/lib/utils/auth/cookie-utils";
import type { UserPackSubscription } from "@/lib/api/orval/api/generated/model";

type DrawerState =
  | { type: "none" }
  | { type: "editName" }
  | { type: "language"; mode: "speaks" | "learning" }
  | { type: "changePassword" }
  | { type: "deleteAccount" }
  | { type: "modelSelector" };

export function useProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [exploreOpen, setExploreOpen] = useState(false);
  const [actionSheetPack, setActionSheetPack] =
    useState<UserPackSubscription | null>(null);
  const [drawer, setDrawer] = useState<DrawerState>({ type: "none" });

  const { data: user } = useAuthMeRetrieve();
  const { data: models } = useAiModelsList();
  const { data: subscriptions } = usePacksSubscriptionsList({
    status: "active",
  });

  const logoutMutation = useAuthLogoutCreate();
  const updateMeMutation = useAuthMePartialUpdate();
  const deleteMeMutation = useAuthMeDestroy();
  const subscribeMutation = usePacksSubscribeCreate();
  const archiveMutation = usePacksArchiveCreate();
  const unsubscribeMutation = usePacksUnsubscribeDestroy();
  const resetProgressMutation = useProgressPacksResetCreate();

  const subscribedPackIds = useMemo(
    () => (subscriptions ?? []).map((s) => s.pack.id),
    [subscriptions],
  );

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
        { onSuccess: () => onSubscriptionChanged(queryClient) },
      );
    },
    [subscribedPackIds, subscribeMutation, queryClient],
  );

  const handleArchive = useCallback(
    (packId: string) => {
      archiveMutation.mutate(
        { packId },
        { onSuccess: () => onSubscriptionChanged(queryClient) },
      );
    },
    [archiveMutation, queryClient],
  );

  const handleUnsubscribe = useCallback(
    (packId: string) => {
      unsubscribeMutation.mutate(
        { packId },
        { onSuccess: () => onSubscriptionChanged(queryClient) },
      );
    },
    [unsubscribeMutation, queryClient],
  );

  const handleResetProgress = useCallback(
    (packId: string) => {
      resetProgressMutation.mutate(
        { packId },
        {
          onSuccess: () => {
            onProgressChanged(queryClient, packId);
            onSubscriptionChanged(queryClient);
          },
        },
      );
    },
    [resetProgressMutation, queryClient],
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

  const handleSaveModel = useCallback(
    (modelId: string | null) => {
      updateMeMutation.mutate(
        { data: { preferred_model_id: modelId } },
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

  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteMeMutation.mutateAsync();
    } finally {
      setUserToken();
      router.push("/login");
    }
  }, [deleteMeMutation, router]);

  const closeDrawer = useCallback(() => setDrawer({ type: "none" }), []);

  const estimatedPrompts = useMemo(() => {
    if (!user?.credit_balance || !models?.length) return null;
    const balance = parseFloat(user.credit_balance);
    const model = models.find((m) => m.id === user.preferred_model_id)
      ?? models.find((m) => m.is_default);
    if (!model || model.approx_cost_eur <= 0) return null;
    return Math.floor(balance / model.approx_cost_eur);
  }, [user?.credit_balance, user?.preferred_model_id, models]);

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
    handleResetProgress,
    handleSignOut,
    handleSaveName,
    handleSaveLanguage,
    handleSaveModel,
    handleDeleteAccount,
    estimatedPrompts,
    isUpdatingProfile: updateMeMutation.isPending,
    isDeletingAccount: deleteMeMutation.isPending,
  };
}
