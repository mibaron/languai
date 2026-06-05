import type { AuthLayoutProps } from "./types";

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-6 text-center">
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wider text-primary-foreground">
          LinguAI
        </span>
      </div>
      {children}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Learn German with structured content &middot; A1 to C2
      </p>
    </div>
  );
}
