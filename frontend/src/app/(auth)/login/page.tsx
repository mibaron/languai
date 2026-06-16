"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoginSuccess = () => {
    const next = searchParams.get("next") || "/learn";
    router.push(next);
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
