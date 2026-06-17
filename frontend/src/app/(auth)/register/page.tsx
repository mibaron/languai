"use client";

import { useRouter } from "next/navigation";

import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = () => {
    router.push("/learn");
  };

  return (
    <AuthLayout>
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </AuthLayout>
  );
}
