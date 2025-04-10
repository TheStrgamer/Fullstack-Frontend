import axios from 'axios';
import { postDataWithoutAuth } from './httpService';

interface TokenResponse {
  token: string;
  expiration: number;
}

export async function getJwtToken(email: string, password: string): Promise<TokenResponse> {
  if (!email && !password) {
    throw new Error("Email and password are required");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  try {
    const response = await postDataWithoutAuth('users/login', {
      email: email,
      password: password
    });

    if (!response || !response.data) {
      throw new Error("Login Failed!");
    }

    console.log('Login successful:', response.data);

    return response.data;

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}