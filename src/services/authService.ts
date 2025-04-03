import axios from 'axios';

export async function getJwtToken(email: string, password: string): Promise<string> {
  try {
    const response = await axios.post('http://localhost:8080/api/users/login', {
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