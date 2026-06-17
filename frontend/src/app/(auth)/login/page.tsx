"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { useOnboardingSync } from "@/hooks/use-onboarding-sync";

function LoginContent() {
  const searchParams = useSearchParams();
  const { syncAndRedirect } = useOnboardingSync();

  const handleLoginSuccess = () => {
    const next = searchParams.get("next") || "/learn";
    syncAndRedirect(next);
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense>
        <LoginContent />
      </Suspense>
    </AuthLayout>
  );
}
