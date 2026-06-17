import { cn } from "@/lib/utils";

import type { PasswordStrength } from "./types";

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels: PasswordStrength[] = [
    { score: 1, label: "Weak", color: "bg-red-500" },
    { score: 2, label: "Fair", color: "bg-orange-500" },
    { score: 3, label: "Good", color: "bg-yellow-500" },
    { score: 4, label: "Strong", color: "bg-green-500" },
  ];

  return levels[Math.max(0, score - 1)] ?? levels[0];
}

interface PasswordStrengthBarProps {
  password: string;
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-[3px] flex-1 rounded-full transition-colors",
              i <= strength.score ? strength.color : "bg-border",
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          "mt-1 block text-[11px]",
          strength.score <= 1
            ? "text-red-500"
            : strength.score === 2
              ? "text-orange-500"
              : strength.score === 3
                ? "text-yellow-500"
                : "text-green-500",
        )}
      >
        {strength.label}
      </span>
    </div>
  );
}
