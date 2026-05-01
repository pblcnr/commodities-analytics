const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

export type Enterprise = {
  id: number;
  enterprise_name: string;
  cnpj: string;
  address: string;
  cep: string;
  email: string;
  phone: string;
  type: string[];
};

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getEnterprises(): Promise<Enterprise[]> {
  const response = await fetch(`${API_URL}/enterprises`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch enterprises');
  }

  return response.json();
}
