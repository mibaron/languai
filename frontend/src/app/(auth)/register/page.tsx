"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import { useOnboardingSync } from "@/hooks/use-onboarding-sync";

export default function RegisterPage() {
  const { syncAndRedirect } = useOnboardingSync();

  const handleRegisterSuccess = () => {
    syncAndRedirect("/learn");
  };

  return (
    <AuthLayout>
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </AuthLayout>
  );
}
