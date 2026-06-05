export interface LoginFormProps {
  onSuccess: (token: string) => void;
}

export interface LoginFormState {
  username: string;
  password: string;
  error: string | null;
  isLoading: boolean;
}

export interface AuthLayoutProps {
  children: React.ReactNode;
}
