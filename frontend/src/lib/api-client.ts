const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  } as Record<string, string>;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    throw new Error('Não autorizado. Redirecionando...');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro na requisição');
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: unknown, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
