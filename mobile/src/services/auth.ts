const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:9000/api/v1';

export const loginApi = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro ao fazer login. Verifique suas credenciais.');
  }

  const data = await response.json();
  return data; // Expected: { accessToken, user }
};
