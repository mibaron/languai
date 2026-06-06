export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  native_language?: string;
}

export interface GoogleCredential {
  credential: string;
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
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
}
