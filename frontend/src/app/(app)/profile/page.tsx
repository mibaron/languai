"use client";

import {
  Globe,
  BookOpen,
  Package,
  Sparkles,
  Bookmark,
  Lock,
  LogOut,
  Trash2,
  ChevronRight,
  Compass,
  MoreVertical,
  Pencil,
} from "lucide-react";

import { getLanguageLabel } from "@/lib/languages";

import { ChangePasswordDrawer } from "./_components/change-password-drawer";
import { DeleteAccountDialog } from "./_components/delete-account-dialog";
import { EditNameDrawer } from "./_components/edit-name-drawer";
import { ExplorePacksView } from "./_components/explore-packs-view";
import { LanguageDrawer } from "./_components/language-drawer";
import { PackActionSheet } from "./_components/pack-action-sheet";
import { ProfileRow } from "./_components/profile-row";
import { ProfileSection } from "./_components/profile-section";
import { useProfile } from "./_hooks/use-profile";

export default function ProfilePage() {
  const {
    user,
    subscriptions,
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
    isUpdatingProfile,
    isDeletingAccount,
  } = useProfile();

  const firstName = user?.first_name ?? "";
  const lastName = user?.last_name ?? "";
  const displayName =
    [firstName, lastName].filter(Boolean).join(" ") || user?.username || "User";
  const displayEmail = user?.email ?? "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-border/50 bg-muted/30 px-4 py-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-14 items-center justify-center rounded-full border-2 border-brand/30 bg-brand-muted">
              <span className="text-2xl font-bold text-brand">{initial}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[17px] font-bold tracking-[-0.01em] text-foreground">
                {displayName}
              </div>
              {displayEmail && (
                <div className="text-[13px] text-muted-foreground">
                  {displayEmail}
                </div>
              )}
            </div>
            <button
              onClick={() => setDrawer({ type: "editName" })}
              className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground"
            >
              <Pencil size={15} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-4 pb-8 pt-4">
          <button
            onClick={() => setExploreOpen(true)}
            className="flex w-full items-center gap-3.5 rounded-[14px] border-[1.5px] border-brand/30 bg-brand-muted p-4"
          >
            <div className="flex size-[42px] shrink-0 items-center justify-center rounded-[11px] bg-brand">
              <Compass size={19} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-brand">
                Browse Packs
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Discover and subscribe to content packs
              </div>
            </div>
            <ChevronRight size={16} className="text-brand" />
          </button>

          <ProfileSection title="Languages">
            <ProfileRow
              icon={Globe}
              label="Speaks"
              value={getLanguageLabel(user?.native_language ?? "en")}
              onClick={() =>
                setDrawer({ type: "language", mode: "speaks" })
              }
            />
            <ProfileRow
              icon={BookOpen}
              label="Learning"
              value={getLanguageLabel(user?.learning_language ?? "de")}
              onClick={() =>
                setDrawer({ type: "language", mode: "learning" })
              }
              last
            />
          </ProfileSection>

          <ProfileSection title="My Packs">
            {subscriptions.length === 0 ? (
              <div className="p-3.5 text-[13px] text-muted-foreground">
                No packs yet. Explore to add some!
              </div>
            ) : (
              subscriptions.map((sub, i) => (
                <ProfileRow
                  key={sub.id}
                  icon={Package}
                  label={sub.pack.title}
                  value={`in ${sub.pack.base_language} · Active`}
                  last={i === subscriptions.length - 1}
                  action={
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionSheetPack(sub);
                      }}
                      className="p-1"
                    >
                      <MoreVertical
                        size={16}
                        className="text-muted-foreground"
                      />
                    </button>
                  }
                />
              ))
            )}
          </ProfileSection>

          <ProfileSection title="Account">
            <ProfileRow
              icon={Sparkles}
              label="AI Credits"
              value={
                user?.credit_balance
                  ? `€${parseFloat(user.credit_balance).toFixed(2)} remaining`
                  : undefined
              }
            />
            <ProfileRow icon={Bookmark} label="Saved Items" />
            <ProfileRow
              icon={Lock}
              label="Change Password"
              onClick={() => setDrawer({ type: "changePassword" })}
              last
            />
          </ProfileSection>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm font-medium text-red-500"
          >
            <LogOut size={18} />
            Sign Out
          </button>

          <button
            onClick={() => setDrawer({ type: "deleteAccount" })}
            className="flex w-full items-center gap-2.5 rounded-xl border border-border/50 px-4 py-3.5 text-sm font-medium text-muted-foreground"
          >
            <Trash2 size={18} />
            Delete Account
          </button>
        </div>
      </div>

      <ExplorePacksView
        open={exploreOpen}
        subscribedPackIds={subscribedPackIds}
        onSubscribe={handleSubscribe}
        onClose={() => setExploreOpen(false)}
      />

      <PackActionSheet
        subscription={actionSheetPack}
        onClose={() => setActionSheetPack(null)}
        onArchive={handleArchive}
        onUnsubscribe={handleUnsubscribe}
      />

      <EditNameDrawer
        open={drawer.type === "editName"}
        firstName={firstName}
        lastName={lastName}
        onSave={handleSaveName}
        onClose={closeDrawer}
        isSaving={isUpdatingProfile}
      />

      <LanguageDrawer
        open={drawer.type === "language"}
        mode={drawer.type === "language" ? drawer.mode : "speaks"}
        currentValue={
          drawer.type === "language" && drawer.mode === "learning"
            ? (user?.learning_language ?? "de")
            : (user?.native_language ?? "en")
        }
        onSave={handleSaveLanguage}
        onClose={closeDrawer}
        isSaving={isUpdatingProfile}
      />

      <ChangePasswordDrawer
        open={drawer.type === "changePassword"}
        onClose={closeDrawer}
      />

      <DeleteAccountDialog
        open={drawer.type === "deleteAccount"}
        onOpenChange={(open) => {
          if (!open) closeDrawer();
        }}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
      />
    </div>
  );
}
