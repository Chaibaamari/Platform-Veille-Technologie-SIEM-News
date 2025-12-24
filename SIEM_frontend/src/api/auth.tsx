/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiMutation } from './client';

export interface LoginRequest {
  email: string;
  password: string;
};

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    roles: Array<{
      id: number;
      name: string;
    }>;
  };
  token: string;
  message: string;
}

export const authApi = {
  // login: async (credentials: LoginRequest): Promise<LoginResponse> => {
  //     return apiMutation('login', {
  //         method: 'POST',
  //         body: JSON.stringify(credentials),
  //     });
  // },
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Fake token generation (in real app, server does this)
    const fakeToken = 'fake-jwt-token-' + Math.random().toString(36).substr(2);

    // Find user in db.json
    const response = await fetch('http://localhost:4000/users');
    const users = await response.json();

    const user = users.find(
      (u: any) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Return format matching your Login component expectation
    return {
      token: fakeToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      message: 'Login successful',
    };
  },

  logout: async () => {
    return apiMutation('logout', {
      method: 'POST',
    });
  },
};


