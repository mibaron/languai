import { client } from "@/lib/api/orval/client";
import type {
  AuthError,
  AuthResponse,
  GoogleCredential,
  LoginCredentials,
  RegisterCredentials,
} from "@/types/auth";

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>("/auth/login/", credentials);
  return response.data;
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>("/auth/register/", credentials);
  return response.data;
}

export async function googleLogin(credential: GoogleCredential): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>("/auth/google/", credential);
  return response.data;
}

export async function logout(): Promise<void> {
  await client.post("/auth/logout/");
}

export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const responseError = error as { response?: { data?: AuthError; status?: number } };
    const data = responseError.response?.data;

    if (data?.error?.message) return data.error.message;
    if (data?.non_field_errors?.[0]) return data.non_field_errors[0];
    if (data?.username?.[0]) return `Username: ${data.username[0]}`;
    if (data?.email?.[0]) return `Email: ${data.email[0]}`;
    if (data?.password?.[0]) return `Password: ${data.password[0]}`;

    if (responseError.response?.status === 401) return "Invalid username or password";
  }
  return "Something went wrong. Please try again.";
}
