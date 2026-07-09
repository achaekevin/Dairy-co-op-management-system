export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  tenantId?: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
  tenantId?: string;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface ForgotPasswordData {
  email: string;
  tenantId?: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId: string;
    isEmailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}
