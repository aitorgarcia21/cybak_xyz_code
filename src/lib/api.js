// API client for CYBAK backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://cybak.xyz/api' 
  : 'http://localhost:8080/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('cybak_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('cybak_token', token);
    } else {
      localStorage.removeItem('cybak_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur API');
    }

    return data;
  }

  // Auth methods
  async signUp(userData) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: userData,
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async signIn(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async signOut() {
    this.setToken(null);
    return { error: null };
  }

  async getCurrentUser() {
    try {
      const response = await this.request('/auth/me');
      return { user: response.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  // Audit methods
  async createAudit(url) {
    return await this.request('/audits', {
      method: 'POST',
      body: { url },
    });
  }

  async getUserAudits() {
    return await this.request('/audits');
  }

  async getAudit(auditId) {
    return await this.request(`/audits/${auditId}`);
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export auth helpers with same interface as Supabase
export const auth = {
  signUp: async (email, password, userData = {}) => {
    try {
      const response = await apiClient.signUp({
        email,
        password,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
      });
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  signIn: async (email, password) => {
    try {
      const response = await apiClient.signIn(email, password);
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  signOut: async () => {
    return await apiClient.signOut();
  },

  getCurrentUser: async () => {
    return await apiClient.getCurrentUser();
  },

  getSession: async () => {
    const { user, error } = await apiClient.getCurrentUser();
    return { 
      session: user ? { user } : null, 
      error 
    };
  },

  onAuthStateChange: (callback) => {
    // Simple implementation - in a real app you'd want to use WebSocket or polling
    const checkAuth = async () => {
      const { user } = await apiClient.getCurrentUser();
      callback('SIGNED_IN', { user });
    };
    
    // Check immediately
    checkAuth();
    
    // Return unsubscribe function
    return () => {};
  }
};

// Export database helpers
export const db = {
  users: {
    create: async (userData) => {
      try {
        const response = await apiClient.signUp(userData);
        return { data: [response.user], error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    getById: async (id) => {
      try {
        const response = await apiClient.getCurrentUser();
        return { data: response.user, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  },

  audits: {
    create: async (auditData) => {
      try {
        const response = await apiClient.createAudit(auditData.url);
        return { data: [response.audit], error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    getByUserId: async (userId) => {
      try {
        const response = await apiClient.getUserAudits();
        return { data: response.audits, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    getById: async (id) => {
      try {
        const response = await apiClient.getAudit(id);
        return { data: response.audit, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  }
};

export default apiClient;
