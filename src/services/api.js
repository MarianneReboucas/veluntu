const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper para requisições HTTP com suporte a Auth JWT
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('veluntu_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // If 401 Unauthorized, clear stale token
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('veluntu_token');
        localStorage.removeItem('veluntu_user');
        localStorage.removeItem('veluntu_agency');
      }
      throw new Error(data.error || data.message || 'Erro ao processar requisição');
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  registerAgency: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/auth/me'),

  // Public
  getPublicPackages: (destination = '') => {
    const query = destination ? `?destination=${encodeURIComponent(destination)}` : '';
    return apiRequest(`/public/packages${query}`);
  },
  createPublicReservation: (data) => apiRequest('/public/reservations', { method: 'POST', body: JSON.stringify(data) }),

  // Dashboard & SaaS (Agency protected)
  getDashboardStats: () => apiRequest('/stats'),
  getPackages: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest(`/packages${query}`);
  },
  getPackageById: (id) => apiRequest(`/packages/${id}`),
  createPackage: (data) => apiRequest('/packages', { method: 'POST', body: JSON.stringify(data) }),
  updatePackage: (id, data) => apiRequest(`/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePackage: (id) => apiRequest(`/packages/${id}`, { method: 'DELETE' }),

  getReservations: (status = '', search = '') => {
    const params = new URLSearchParams();
    if (status && status !== 'todas') params.append('status', status);
    if (search) params.append('search', search);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/reservations${queryString}`);
  },
  createReservation: (data) => apiRequest('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  updateReservation: (id, data) => apiRequest(`/reservations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReservation: (id) => apiRequest(`/reservations/${id}`, { method: 'DELETE' }),
};

export default api;
