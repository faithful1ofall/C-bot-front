const API_BASE_URL = process.env.REACT_APP_BACKENDAPI;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.abortControllers = new Map();
  }

  getAuthHeaders() {
    const token = localStorage.getItem('jwtToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const { method = 'GET', body, signal, skipAuth = false } = options;
    
    const config = {
      method,
      headers: skipAuth ? { 'Content-Type': 'application/json' } : this.getAuthHeaders(),
      ...(body && { body: JSON.stringify(body) }),
      ...(signal && { signal }),
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.error || data.message || 'Request failed',
          data,
        };
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw { message: 'Request cancelled', cancelled: true };
      }
      throw error;
    }
  }

  createAbortController(key) {
    this.cancelRequest(key);
    const controller = new AbortController();
    this.abortControllers.set(key, controller);
    return controller;
  }

  cancelRequest(key) {
    const controller = this.abortControllers.get(key);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(key);
    }
  }

  // Admin routes
  async adminSignIn(password) {
    return this.request('/api/admin/signin', {
      method: 'POST',
      body: { password },
      skipAuth: true,
    });
  }

  async adminSignUp(password) {
    return this.request('/api/admin/signup', {
      method: 'GET',
      body: { password },
      skipAuth: true,
    });
  }

  // User routes
  async getUsers(signal) {
    return this.request('/api/users', { signal });
  }

  async getUserById(id, signal) {
    return this.request(`/api/users/${id}`, { signal });
  }

  async createUser(userData) {
    return this.request('/api/users', {
      method: 'POST',
      body: userData,
    });
  }

  async updateUser(id, userData) {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: userData,
    });
  }

  async deleteUser(id) {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserSettings(id, signal) {
    return this.request(`/api/users/${id}/settings`, { signal });
  }

  async updateUserSettings(id, settings) {
    return this.request(`/api/users/${id}/settings`, {
      method: 'POST',
      body: settings,
    });
  }

  // Strategy routes
  async getStrategies(signal) {
    return this.request('/api/strategies', { signal });
  }

  async getStrategyById(id, signal) {
    return this.request(`/api/strategy/${id}`, { signal });
  }

  async createStrategy(strategyData) {
    return this.request('/api/strategy', {
      method: 'POST',
      body: strategyData,
    });
  }

  async updateStrategy(id, strategyData) {
    return this.request(`/api/strategy/${id}`, {
      method: 'PUT',
      body: strategyData,
    });
  }

  async deleteStrategy(id) {
    return this.request(`/api/strategies/${id}`, {
      method: 'DELETE',
    });
  }

  async linkStrategyToUser(userId, strategyId) {
    return this.request(`/api/users/${userId}/strategies/${strategyId}`, {
      method: 'POST',
    });
  }

  async unlinkStrategyFromUser(userId, strategyId) {
    return this.request(`/api/users/${userId}/strategies/${strategyId}`, {
      method: 'DELETE',
    });
  }

  async getStrategyUsers(strategyId, signal) {
    return this.request(`/api/strategies/${strategyId}/users`, { signal });
  }

  // Trading pairs routes
  async getTradingPairs(signal) {
    return this.request('/api/trading-pairs', { signal });
  }

  async getSavedTradingPairs(signal) {
    return this.request('/api/saved-trading-pairs', { signal });
  }

  async updateTradingPairSelection(id, selected) {
    return this.request(`/api/trading-pairs/${id}/select`, {
      method: 'PUT',
      body: { selected },
    });
  }

  // Binance routes
  async getBinancePastTrades(signal) {
    return this.request('/api/binance/all-past-trades', { signal });
  }

  async getBinanceExchangeInfo(userId, signal) {
    return this.request(`/api/binance/all-exchange-info/${userId}`, { signal });
  }

  async validateBinanceCredentials(userId, signal) {
    return this.request(`/api/binance/valid/${userId}`, { signal });
  }

  async closePosition(userId, symbol) {
    return this.request(`/api/binance/close-position/${userId}/${symbol}`, {
      method: 'POST',
    });
  }

  // Logs routes
  async getLogs(page = 1, limit = 50, signal) {
    return this.request(`/api/logs?page=${page}&limit=${limit}`, { signal });
  }

  // Webhook route
  getTradingViewWebhookUrl() {
    return `${this.baseURL}/api/tradingview-webhook`;
  }
}

export default new ApiService();
