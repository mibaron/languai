export interface LoginFormProps {
  onSuccess: (token: string) => void;
}

export interface LoginFormState {
  username: string;
  password: string;
  error: string | null;
  isLoading: boolean;
}

export interface RegisterFormProps {
  onSuccess: (token: string) => void;
}

export interface RegisterFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  isLoading: boolean;
}

export interface GoogleSignInButtonProps {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
}

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}
