export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  native_language: string;
  current_level: string;
  date_joined: string;
}

export interface AuthError {
  error?: {
    code: string;
    message: string;
  };
  username?: string[];
  password?: string[];
  non_field_errors?: string[];
}
