"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoginSuccess = () => {
    const next = searchParams.get("next") || "/";
    router.push(next);
  };

  return (
    <AuthLayout>
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}
