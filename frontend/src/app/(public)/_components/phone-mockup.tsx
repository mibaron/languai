import {
  BookOpen,
  BarChart3,
  ChevronRight,
  Compass,
  User,
} from "lucide-react";

function StatusBar() {
  return (
    <div className="flex items-center justify-between bg-white px-5 pt-3.5 pb-1.5 text-[11px] font-semibold text-zinc-900">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <svg width="15" height="11" viewBox="0 0 15 11" fill="#18181b">
          <rect x="0" y="4" width="3" height="7" rx="1" />
          <rect x="4" y="2" width="3" height="9" rx="1" />
          <rect x="8" y="0" width="3" height="11" rx="1" />
          <rect x="12" y="0" width="3" height="11" rx="1" opacity="0.3" />
        </svg>
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="18"
            height="10"
            rx="2"
            stroke="#18181b"
            strokeOpacity="0.35"
          />
          <rect
            x="1.5"
            y="1.5"
            width="14"
            height="8"
            rx="1.5"
            fill="#18181b"
          />
        </svg>
      </div>
    </div>
  );
}

function PhoneHeader() {
  return (
    <div className="flex items-center border-b border-zinc-100 bg-white px-4 py-1.5">
      <div className="flex flex-1 items-center gap-1.5">
        <div className="flex size-6 items-center justify-center rounded-md bg-[#2563eb]">
          <BookOpen className="size-3 text-white" />
        </div>
        <span className="text-sm font-bold tracking-tight text-zinc-900">
          Langu-AI
        </span>
      </div>
      <div className="flex size-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500">
        A
      </div>
    </div>
  );
}

function PhoneTabs() {
  const tabs = ["Grammar", "Vocabulary", "Verbs", "Phrases"];
  return (
    <div className="flex border-b border-zinc-100">
      {tabs.map((tab, i) => (
        <div
          key={tab}
          className={`flex-1 -mb-px border-b-2 py-1.5 text-center text-[10px] ${
            i === 0
              ? "font-bold text-[#2563eb] border-[#2563eb]"
              : "font-normal text-zinc-400 border-transparent"
          }`}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

interface SectionRowProps {
  title: string;
  progress?: number;
  progressColor?: string;
  subtitle?: string;
  iconColor: string;
  iconBg: string;
  type: "table" | "notes";
}

function SectionRow({
  title,
  progress,
  progressColor,
  subtitle,
  iconColor,
  iconBg,
  type,
}: SectionRowProps) {
  return (
    <div className="flex items-center gap-2.5 border-b border-zinc-50 px-4 py-2.5">
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: iconBg }}
      >
        {type === "table" ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 3v18" />
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M3 15h18" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="21" x2="3" y1="6" y2="6" />
            <line x1="15" x2="3" y1="12" y2="12" />
            <line x1="17" x2="3" y1="18" y2="18" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <div className="text-[11px] font-medium text-zinc-900">{title}</div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[9px]">
          {progress !== undefined ? (
            <>
              <div className="h-[3px] w-12 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: progressColor,
                  }}
                />
              </div>
              {progress === 100 ? (
                <span className="font-semibold" style={{ color: progressColor }}>
                  ✓ Done
                </span>
              ) : (
                <span className="text-zinc-500">{progress}%</span>
              )}
            </>
          ) : (
            <span className="text-zinc-400">{subtitle}</span>
          )}
        </div>
      </div>
      <ChevronRight className="size-2.5 text-zinc-300" />
    </div>
  );
}

function BottomNav() {
  const items = [
    { icon: BookOpen, label: "Learn", active: true },
    { icon: BarChart3, label: "Practice", active: false },
    { icon: Compass, label: "Explore", active: false },
    { icon: User, label: "Profile", active: false },
  ];
  return (
    <div className="absolute right-0 bottom-0 left-0 flex border-t border-zinc-100 bg-white pb-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex flex-1 flex-col items-center gap-0.5 pt-2 text-[8px] ${
            item.active
              ? "font-bold text-[#2563eb]"
              : "font-normal text-zinc-400"
          }`}
        >
          <item.icon className="size-4" strokeWidth={item.active ? 2.25 : 1.75} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

export function PhoneMockup() {
  return (
    <div className="hidden items-center justify-center lg:flex [perspective:1200px]">
      <div className="transition-transform duration-500 ease-out [transform:rotateY(-12deg)_rotateX(3deg)] [transform-style:preserve-3d] hover:[transform:rotateY(-4deg)_rotateX(1deg)]">
        <div className="relative h-[560px] w-[270px] overflow-hidden rounded-[46px] border-[9px] border-[#1a1a1f] bg-white shadow-[0_60px_120px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.07),inset_0_1px_0_rgba(255,255,255,0.15)]">
          <StatusBar />
          <PhoneHeader />
          <div className="px-4 pt-2.5 pb-1.5">
            <div className="text-sm font-bold tracking-tight text-zinc-900">
              German A1.1
            </div>
            <div className="text-[10px] text-zinc-500">in English</div>
          </div>
          <PhoneTabs />
          <SectionRow
            title="Personal Pronouns"
            progress={100}
            progressColor="#16a34a"
            iconBg="#f0f9ff"
            iconColor="#0369a1"
            type="table"
          />
          <SectionRow
            title="Regular Verbs — Present"
            progress={75}
            progressColor="#2563eb"
            iconBg="#f0f9ff"
            iconColor="#0369a1"
            type="table"
          />
          <SectionRow
            title="Articles — der, die, das"
            subtitle="6 rules"
            iconBg="#f8f8fa"
            iconColor="#71717a"
            type="notes"
          />
          <SectionRow
            title="Modal Verbs"
            subtitle="8 rows"
            iconBg="#f8f8fa"
            iconColor="#71717a"
            type="notes"
          />
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
