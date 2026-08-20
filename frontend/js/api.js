// Veluntu API Client
class VeluntuAPI {
  constructor() {
    this.baseUrl = (window.APP_CONFIG && window.APP_CONFIG.API_URL) || '/api';
    this.token = localStorage.getItem('authToken') || null;
  }

  getToken() {
    return this.token || localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  async request(endpoint, method = 'GET', data = null, customHeaders = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
          this.clearToken();
          if (!window.location.pathname.includes('auth.html')) {
            window.location.href = '/frontend/auth.html';
          }
        }
      }

      const resData = await response.json().catch(() => ({ error: 'Resposta inválida do servidor.' }));

      if (!response.ok) {
        throw new Error(resData.error || `Erro HTTP ${response.status}`);
      }

      return resData;
    } catch (err) {
      console.error(`API Error on [${method}] ${endpoint}:`, err.message);
      throw err;
    }
  }

  // ================= Auth Endpoints =================
  async register(agencyData) {
    return this.request('/auth/register', 'POST', agencyData);
  }

  async login(credentials) {
    return this.request('/auth/login', 'POST', credentials);
  }

  async getMe() {
    return this.request('/auth/me', 'GET');
  }

  async updateAgency(agencyData) {
    return this.request('/auth/agency', 'PUT', agencyData);
  }

  // ================= Packages Endpoints =================
  async getPackages(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/packages${query ? '?' + query : ''}`, 'GET');
  }

  async getPackage(packageId) {
    return this.request(`/packages/${packageId}`, 'GET');
  }

  async createPackage(packageData) {
    return this.request('/packages', 'POST', packageData);
  }

  async updatePackage(packageId, packageData) {
    return this.request(`/packages/${packageId}`, 'PUT', packageData);
  }

  async deletePackage(packageId) {
    return this.request(`/packages/${packageId}`, 'DELETE');
  }

  // ================= Reservations Endpoints =================
  async getReservations(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/reservations${query ? '?' + query : ''}`, 'GET');
  }

  async createReservation(reservationData) {
    return this.request('/reservations', 'POST', reservationData);
  }

  async updateReservation(reservationId, reservationData) {
    return this.request(`/reservations/${reservationId}`, 'PUT', reservationData);
  }

  async deleteReservation(reservationId) {
    return this.request(`/reservations/${reservationId}`, 'DELETE');
  }

  // ================= Analytics & Stats =================
  async getStats() {
    return this.request('/stats', 'GET');
  }

  // ================= Public Endpoints =================
  async getPublicPackages(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/public/packages${query ? '?' + query : ''}`, 'GET');
  }

  async createPublicReservation(leadData) {
    return this.request('/public/reservations', 'POST', leadData);
  }
}

// Global API instance
window.api = new VeluntuAPI();
