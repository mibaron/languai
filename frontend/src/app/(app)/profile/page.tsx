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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { setUserToken } from "@/lib/utils/auth/cookie-utils";
import { usePacksSubscriptionsList } from "@/lib/api/orval/api/generated/packs/packs";

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 pl-1 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">
        {title}
      </div>
      <div className="overflow-hidden rounded-[14px] border border-border bg-card">
        {children}
      </div>
    </div>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value,
  last,
  onClick,
}: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  value?: string;
  last?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-3.5 py-[13px]",
        !last && "border-b border-border/50",
        onClick && "cursor-pointer text-left",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-muted">
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-foreground">{label}</div>
        {value && (
          <div className="mt-0.5 text-xs text-muted-foreground/70">
            {value}
          </div>
        )}
      </div>
      <ChevronRight size={16} className="text-muted-foreground/30" />
    </Tag>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: subscriptions } = usePacksSubscriptionsList({
    status: "active",
  });

  const handleSignOut = () => {
    setUserToken();
    router.push("/login");
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border/50 bg-muted/30 px-4 py-5">
        <div className="flex items-center gap-3.5">
          <div className="flex size-14 items-center justify-center rounded-full border-2 border-brand/30 bg-brand-muted">
            <span className="text-2xl font-bold text-brand">U</span>
          </div>
          <div>
            <div className="text-[17px] font-bold tracking-[-0.01em] text-foreground">
              User
            </div>
            <div className="text-[13px] text-muted-foreground">
              user@example.com
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4 pb-8 pt-4">
        <button className="flex w-full items-center gap-3.5 rounded-[14px] border-[1.5px] border-brand/30 bg-brand-muted p-4">
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
          <ProfileRow
            icon={BookOpen}
            label="Learning"
            value="German"
            last
          />
        </ProfileSection>

        <ProfileSection title="My Packs">
          {!subscriptions || subscriptions.length === 0 ? (
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
              />
            ))
          )}
        </ProfileSection>

        <ProfileSection title="Account">
          <ProfileRow
            icon={Sparkles}
            label="AI Credits"
            value="250 remaining"
          />
          <ProfileRow
            icon={Bookmark}
            label="Saved Items"
            value="12 saved"
          />
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
  );
}
