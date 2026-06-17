"use client";

import {
  Globe,
  BookOpen,
  Package,
  Sparkles,
  Bookmark,
  Settings,
  LogOut,
  ChevronRight,
  Compass,
  MoreVertical,
} from "lucide-react";

import { ExplorePacksView } from "./_components/explore-packs-view";
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
    handleSubscribe,
    handleArchive,
    handleUnsubscribe,
    handleSignOut,
  } = useProfile();

  const displayName = user?.username ?? "User";
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
            <div>
              <div className="text-[17px] font-bold tracking-[-0.01em] text-foreground">
                {displayName}
              </div>
              {displayEmail && (
                <div className="text-[13px] text-muted-foreground">
                  {displayEmail}
                </div>
              )}
            </div>
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
            <ProfileRow icon={Globe} label="Speaks" value="English" />
            <ProfileRow icon={BookOpen} label="Learning" value="German" last />
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
            <ProfileRow icon={Settings} label="Settings" last />
          </ProfileSection>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm font-medium text-red-500"
          >
            <LogOut size={18} />
            Sign Out
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
    </div>
  );
}
