import type { ForgotForm } from '@/pages/auth/ForgotPassword';
import { apiMutation } from './client';

export interface LoginRequest {
  email: string;
  password: string;
};

export interface LoginResponse {
  status: string;
  message: string;
  user: {
    id_utilisateur: number;
    nom_utilisateur: string;
    email_utilisateur: string;
    role_utilisateur: string; 
  };
  tokens: {
    access: string;
  };
}


export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    return apiMutation('auth/login/', {   // ← adjust endpoint path !!!
      method: 'POST',
      body: JSON.stringify({
        email_utilisateur: credentials.email,     // ← field name must match serializer
        password: credentials.password,
      }),
    });
  },

  // Optional: helper to get current user (using access token or cookie)
  getProfile: async () => {
    return apiMutation('auth/profile/', { method: 'GET' });
  },

  refresh: async () => {
    return apiMutation('auth/refresh/', { method: 'POST' });
  },

  logout: async () => {
    try {
      await apiMutation('auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh: "not needed if using cookie" }),
      });
    } catch {
      console.log('Logout API call failed, proceeding to clear local state.');
    }
  },

  forgotPassword : async (data: ForgotForm) => {
    return apiMutation('auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  ResetPassword : async (token: string, new_password: string , confirm_password:string) => {
    return apiMutation('auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify({ token, new_password , confirm_password }),
    });
  }
};