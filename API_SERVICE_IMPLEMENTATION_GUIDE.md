# API Service Layer Implementation Guide

## Overview

This guide provides a complete implementation plan for creating a centralized API service layer to replace the scattered fetch calls throughout the application.

---

## 1. Architecture Overview

```
src/
  services/
    api/
      client.js              # Base API client with interceptors
      endpoints.js           # All API endpoint constants
      auth.api.js            # Authentication endpoints
      users.api.js           # User management endpoints
      strategies.api.js      # Strategy management endpoints
      binance.api.js         # Binance trading endpoints
      trading.api.js         # Trading pairs endpoints
      logs.api.js            # Logging endpoints
      index.js               # Export all services
  hooks/
    useApi.js                # Generic API hook
    useAuth.js               # Authentication hook
    useUsers.js              # User operations hook
    useStrategies.js         # Strategy operations hook
    useTrades.js             # Trading operations hook
  contexts/
    AuthContext.js           # JWT and auth state
    ApiContext.js            # API client and global state
  utils/
    errorHandler.js          # Centralized error handling
    requestInterceptor.js    # Request interceptors
    responseInterceptor.js   # Response interceptors
```

---

## 2. Implementation Steps

### Step 1: Create API Client (client.js)

```javascript
// src/services/api/client.js

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  // Add request interceptor
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Apply request interceptors
  async applyRequestInterceptors(config) {
    let modifiedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }
    return modifiedConfig;
  }

  // Apply response interceptors
  async applyResponseInterceptors(response) {
    let modifiedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    return modifiedResponse;
  }

  // Base request method
  async request(endpoint, options = {}) {
    const { 
      method = 'GET', 
      body, 
      headers = {}, 
      signal,
      ...rest 
    } = options;

    // Build config
    let config = {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      signal,
      ...rest,
    };

    // Add body if present
    if (body) {
      config.body = JSON.stringify(body);
    }

    // Apply request interceptors
    config = await this.applyRequestInterceptors(config);

    // Make request
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      // Apply response interceptors
      const modifiedResponse = await this.applyResponseInterceptors(response);

      // Handle non-OK responses
      if (!modifiedResponse.ok) {
        const error = await modifiedResponse.json().catch(() => ({}));
        throw {
          status: modifiedResponse.status,
          message: error.message || error.error || 'Request failed',
          data: error,
        };
      }

      // Parse JSON response
      return await modifiedResponse.json();
    } catch (error) {
      // Handle network errors
      if (error.name === 'AbortError') {
        throw { status: 0, message: 'Request cancelled', cancelled: true };
      }
      throw error;
    }
  }

  // Convenience methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }
}

// Create instance
const apiClient = new ApiClient(process.env.REACT_APP_BACKENDAPI);

// Add JWT interceptor
apiClient.addRequestInterceptor((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response error interceptor
apiClient.addResponseInterceptor(async (response) => {
  // Handle 401 - redirect to login
  if (response.status === 401) {
    localStorage.removeItem('jwtToken');
    window.location.href = '/auth/sign-in';
  }
  return response;
});

export default apiClient;
```

---

### Step 2: Create Endpoint Constants (endpoints.js)

```javascript
// src/services/api/endpoints.js

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNIN: '/api/admin/signin',
    SIGNUP: '/api/admin/signup',
  },

  // Users
  USERS: {
    LIST: '/api/users',
    GET: (id) => `/api/users/${id}`,
    CREATE: '/api/users',
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,
    SETTINGS: {
      GET: (id) => `/api/users/${id}/settings`,
      UPDATE: (id) => `/api/users/${id}/settings`,
    },
    STRATEGIES: {
      LINK: (userId, strategyId) => `/api/users/${userId}/strategies/${strategyId}`,
      UNLINK: (userId, strategyId) => `/api/users/${userId}/strategies/${strategyId}`,
    },
  },

  // Strategies
  STRATEGIES: {
    LIST: '/api/strategies',
    GET: (id) => `/api/strategy/${id}`,
    CREATE: '/api/strategy',
    UPDATE: (id) => `/api/strategy/${id}`,
    DELETE: (id) => `/api/strategies/${id}`,
    USERS: (id) => `/api/strategies/${id}/users`,
  },

  // Trading Pairs
  TRADING_PAIRS: {
    LIST: '/api/trading-pairs',
    SAVED: '/api/saved-trading-pairs',
    SELECT: (id) => `/api/trading-pairs/${id}/select`,
  },

  // Binance
  BINANCE: {
    VALIDATE: (userId) => `/api/binance/valid/${userId}`,
    EXCHANGE_INFO: (userId) => `/api/binance/all-exchange-info/${userId}`,
    ACCOUNT_INFO: (userId, asset) => `/api/binance/account-info/${userId}/${asset}`,
    POSITIONS: {
      OPEN: '/api/binance/all-open-positions',
      CLOSE: (userId, symbol) => `/api/binance/close-position/${userId}/${symbol}`,
    },
    TRADES: {
      HISTORY: '/api/binance/all-past-trades',
    },
    TRANSFER: (userId) => `/api/binance/user-universal-transfer/${userId}`,
    APPLY_STRATEGY: (strategyId) => `/api/binance/applystrategy/${strategyId}`,
  },

  // Webhook
  WEBHOOK: {
    TRADINGVIEW: '/api/tradingview-webhook',
  },

  // Logs
  LOGS: {
    LIST: '/api/logs',
  },
};

export default ENDPOINTS;
```

---

### Step 3: Create Service Modules

#### 3.1 Authentication Service (auth.api.js)

```javascript
// src/services/api/auth.api.js

import apiClient from './client';
import ENDPOINTS from './endpoints';

export const authApi = {
  /**
   * Sign in admin user
   * @param {string} password - Admin password
   * @returns {Promise<{token: string}>}
   */
  signin: async (password) => {
    return apiClient.post(ENDPOINTS.AUTH.SIGNIN, { password });
  },

  /**
   * Sign up admin user
   * @param {string} password - Admin password
   * @returns {Promise<{token: string}>}
   */
  signup: async (password) => {
    return apiClient.get(ENDPOINTS.AUTH.SIGNUP, { 
      headers: { password } 
    });
  },
};

export default authApi;
```

#### 3.2 Users Service (users.api.js)

```javascript
// src/services/api/users.api.js

import apiClient from './client';
import ENDPOINTS from './endpoints';

export const usersApi = {
  /**
   * Get all users
   * @returns {Promise<Array>}
   */
  getAll: async (signal) => {
    return apiClient.get(ENDPOINTS.USERS.LIST, { signal });
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>}
   */
  getById: async (id, signal) => {
    return apiClient.get(ENDPOINTS.USERS.GET(id), { signal });
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>}
   */
  create: async (userData) => {
    return apiClient.post(ENDPOINTS.USERS.CREATE, userData);
  },

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>}
   */
  update: async (id, updates) => {
    return apiClient.put(ENDPOINTS.USERS.UPDATE(id), updates);
  },

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    return apiClient.delete(ENDPOINTS.USERS.DELETE(id));
  },

  /**
   * Get user settings
   * @param {string} id - User ID
   * @returns {Promise<Object>}
   */
  getSettings: async (id, signal) => {
    return apiClient.get(ENDPOINTS.USERS.SETTINGS.GET(id), { signal });
  },

  /**
   * Update user settings
   * @param {string} id - User ID
   * @param {Object} settings - Settings to update
   * @returns {Promise<Object>}
   */
  updateSettings: async (id, settings) => {
    return apiClient.post(ENDPOINTS.USERS.SETTINGS.UPDATE(id), settings);
  },

  /**
   * Link strategy to user
   * @param {string} userId - User ID
   * @param {string} strategyId - Strategy ID
   * @returns {Promise<Object>}
   */
  linkStrategy: async (userId, strategyId) => {
    return apiClient.post(ENDPOINTS.USERS.STRATEGIES.LINK(userId, strategyId));
  },

  /**
   * Unlink strategy from user
   * @param {string} userId - User ID
   * @param {string} strategyId - Strategy ID
   * @returns {Promise<void>}
   */
  unlinkStrategy: async (userId, strategyId) => {
    return apiClient.delete(ENDPOINTS.USERS.STRATEGIES.UNLINK(userId, strategyId));
  },
};

export default usersApi;
```

#### 3.3 Strategies Service (strategies.api.js)

```javascript
// src/services/api/strategies.api.js

import apiClient from './client';
import ENDPOINTS from './endpoints';

export const strategiesApi = {
  /**
   * Get all strategies
   * @returns {Promise<Array>}
   */
  getAll: async (signal) => {
    return apiClient.get(ENDPOINTS.STRATEGIES.LIST, { signal });
  },

  /**
   * Get strategy by ID
   * @param {string} id - Strategy ID
   * @returns {Promise<Object>}
   */
  getById: async (id, signal) => {
    return apiClient.get(ENDPOINTS.STRATEGIES.GET(id), { signal });
  },

  /**
   * Create new strategy
   * @param {Object} strategyData - Strategy data
   * @returns {Promise<Object>}
   */
  create: async (strategyData) => {
    return apiClient.post(ENDPOINTS.STRATEGIES.CREATE, strategyData);
  },

  /**
   * Update strategy
   * @param {string} id - Strategy ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>}
   */
  update: async (id, updates) => {
    return apiClient.put(ENDPOINTS.STRATEGIES.UPDATE(id), updates);
  },

  /**
   * Delete strategy
   * @param {string} id - Strategy ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    return apiClient.delete(ENDPOINTS.STRATEGIES.DELETE(id));
  },

  /**
   * Get users linked to strategy
   * @param {string} id - Strategy ID
   * @returns {Promise<Array>}
   */
  getUsers: async (id, signal) => {
    return apiClient.get(ENDPOINTS.STRATEGIES.USERS(id), { signal });
  },
};

export default strategiesApi;
```

#### 3.4 Binance Service (binance.api.js)

```javascript
// src/services/api/binance.api.js

import apiClient from './client';
import ENDPOINTS from './endpoints';

export const binanceApi = {
  /**
   * Validate user API credentials
   * @param {string} userId - User ID
   * @returns {Promise<Object>}
   */
  validateCredentials: async (userId, signal) => {
    return apiClient.get(ENDPOINTS.BINANCE.VALIDATE(userId), { signal });
  },

  /**
   * Get exchange info
   * @param {string} userId - User ID
   * @returns {Promise<Object>}
   */
  getExchangeInfo: async (userId, signal) => {
    return apiClient.get(ENDPOINTS.BINANCE.EXCHANGE_INFO(userId), { signal });
  },

  /**
   * Get account info
   * @param {string} userId - User ID
   * @param {string} asset - Asset symbol (default: USDT)
   * @returns {Promise<Object>}
   */
  getAccountInfo: async (userId, asset = 'USDT', signal) => {
    return apiClient.get(ENDPOINTS.BINANCE.ACCOUNT_INFO(userId, asset), { signal });
  },

  /**
   * Get open positions
   * @returns {Promise<Array>}
   */
  getOpenPositions: async (signal) => {
    return apiClient.get(ENDPOINTS.BINANCE.POSITIONS.OPEN, { signal });
  },

  /**
   * Close position
   * @param {string} userId - User ID
   * @param {string} symbol - Trading symbol
   * @returns {Promise<Object>}
   */
  closePosition: async (userId, symbol) => {
    return apiClient.post(ENDPOINTS.BINANCE.POSITIONS.CLOSE(userId, symbol));
  },

  /**
   * Get trade history
   * @param {number} page - Page number
   * @returns {Promise<Object>}
   */
  getTradeHistory: async (page = 1, signal) => {
    return apiClient.get(`${ENDPOINTS.BINANCE.TRADES.HISTORY}?page=${page}`, { signal });
  },

  /**
   * Execute internal transfer
   * @param {string} userId - User ID
   * @param {Object} transferData - Transfer details
   * @returns {Promise<Object>}
   */
  internalTransfer: async (userId, transferData) => {
    return apiClient.post(ENDPOINTS.BINANCE.TRANSFER(userId), transferData);
  },

  /**
   * Apply strategy
   * @param {string} strategyId - Strategy ID
   * @returns {Promise<Object>}
   */
  applyStrategy: async (strategyId) => {
    return apiClient.get(ENDPOINTS.BINANCE.APPLY_STRATEGY(strategyId));
  },
};

export default binanceApi;
```

#### 3.5 Trading Service (trading.api.js)

```javascript
// src/services/api/trading.api.js

import apiClient from './client';
import ENDPOINTS from './endpoints';

export const tradingApi = {
  /**
   * Get all trading pairs
   * @returns {Promise<Array>}
   */
  getAllPairs: async (signal) => {
    return apiClient.get(ENDPOINTS.TRADING_PAIRS.LIST, { signal });
  },

  /**
   * Get saved trading pairs
   * @returns {Promise<Array>}
   */
  getSavedPairs: async (signal) => {
    return apiClient.get(ENDPOINTS.TRADING_PAIRS.SAVED, { signal });
  },

  /**
   * Update pair selection
   * @param {string} id - Pair ID
   * @param {boolean} isSelected - Selection status
   * @returns {Promise<Object>}
   */
  updatePairSelection: async (id, isSelected) => {
    return apiClient.put(ENDPOINTS.TRADING_PAIRS.SELECT(id), { isSelected });
  },

  /**
   * Trigger TradingView webhook
   * @param {string} strategy - Strategy hook key
   * @returns {Promise<Object>}
   */
  triggerWebhook: async (strategy) => {
    return apiClient.post(ENDPOINTS.WEBHOOK.TRADINGVIEW, { strategy });
  },
};

export default tradingApi;
```

#### 3.6 Logs Service (logs.api.js)

```javascript
// src/services/api/logs.api.js

import apiClient from './client';
import ENDPOINTS from './endpoints';

export const logsApi = {
  /**
   * Get logs
   * @param {number} page - Page number
   * @returns {Promise<Object>}
   */
  getLogs: async (page = 1, signal) => {
    return apiClient.get(`${ENDPOINTS.LOGS.LIST}?page=${page}`, { signal });
  },
};

export default logsApi;
```

---

### Step 4: Create Index Export (index.js)

```javascript
// src/services/api/index.js

export { default as apiClient } from './client';
export { default as ENDPOINTS } from './endpoints';
export { default as authApi } from './auth.api';
export { default as usersApi } from './users.api';
export { default as strategiesApi } from './strategies.api';
export { default as binanceApi } from './binance.api';
export { default as tradingApi } from './trading.api';
export { default as logsApi } from './logs.api';

// Re-export for convenience
export const api = {
  auth: authApi,
  users: usersApi,
  strategies: strategiesApi,
  binance: binanceApi,
  trading: tradingApi,
  logs: logsApi,
};

export default api;
```

---

### Step 5: Create Custom Hooks

#### 5.1 Generic API Hook (useApi.js)

```javascript
// src/hooks/useApi.js

import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

export function useApi(apiFunction, options = {}) {
  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation successful',
    errorMessage = 'Operation failed',
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const toast = useToast();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);
      setError(null);

      try {
        // Add signal to last argument if it's an object
        const lastArg = args[args.length - 1];
        if (typeof lastArg === 'object' && lastArg !== null) {
          args[args.length - 1] = { ...lastArg, signal };
        } else {
          args.push(signal);
        }

        const result = await apiFunction(...args);
        setData(result);

        if (showSuccessToast) {
          toast({
            title: successMessage,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        // Don't show error for cancelled requests
        if (err.cancelled) {
          return;
        }

        setError(err);

        if (showErrorToast) {
          toast({
            title: errorMessage,
            description: err.message || 'Please try again',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, showSuccessToast, showErrorToast, successMessage, errorMessage, toast]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

export default useApi;
```

#### 5.2 Users Hook (useUsers.js)

```javascript
// src/hooks/useUsers.js

import { useCallback } from 'react';
import { usersApi } from '../services/api';
import { useApi } from './useApi';

export function useUsers() {
  // Get all users
  const {
    data: users,
    loading: loadingUsers,
    error: usersError,
    execute: fetchUsers,
  } = useApi(usersApi.getAll);

  // Create user
  const {
    loading: creating,
    execute: createUser,
  } = useApi(usersApi.create, {
    showSuccessToast: true,
    successMessage: 'User created successfully',
    onSuccess: () => fetchUsers(),
  });

  // Update user
  const {
    loading: updating,
    execute: updateUser,
  } = useApi(usersApi.update, {
    showSuccessToast: true,
    successMessage: 'User updated successfully',
    onSuccess: () => fetchUsers(),
  });

  // Delete user
  const {
    loading: deleting,
    execute: deleteUser,
  } = useApi(usersApi.delete, {
    showSuccessToast: true,
    successMessage: 'User deleted successfully',
    onSuccess: () => fetchUsers(),
  });

  // Get user settings
  const {
    data: settings,
    loading: loadingSettings,
    execute: fetchSettings,
  } = useApi(usersApi.getSettings);

  // Update user settings
  const {
    loading: updatingSettings,
    execute: updateSettings,
  } = useApi(usersApi.updateSettings, {
    showSuccessToast: true,
    successMessage: 'Settings updated successfully',
  });

  return {
    users,
    loadingUsers,
    usersError,
    fetchUsers,
    createUser,
    creating,
    updateUser,
    updating,
    deleteUser,
    deleting,
    settings,
    loadingSettings,
    fetchSettings,
    updateSettings,
    updatingSettings,
  };
}

export default useUsers;
```

---

## 3. Usage Examples

### Example 1: Sign In Component

**Before:**
```javascript
const handleSignin = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/admin/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("jwtToken", data.token);
      navigate("/admin/default");
    }
  } catch (error) {
    console.error('Request failed', error);
  } finally {
    setLoading(false);
  }
};
```

**After:**
```javascript
import { authApi } from '../services/api';
import { useApi } from '../hooks/useApi';

function SignIn() {
  const navigate = useNavigate();
  const { loading, execute: signin } = useApi(authApi.signin, {
    onSuccess: (data) => {
      localStorage.setItem("jwtToken", data.token);
      navigate("/admin/default");
    },
  });

  const handleSignin = useCallback(async () => {
    await signin(password);
  }, [password, signin]);

  return (
    <Button onClick={handleSignin} isLoading={loading}>
      Sign In
    </Button>
  );
}
```

### Example 2: User List Component

**Before:**
```javascript
const fetchUsers = useCallback(async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${jwttoken}` },
    });
    const data = await response.json();
    setUsers(data);
  } catch (err) {
    console.error(err.message);
  }
}, [jwttoken]);
```

**After:**
```javascript
import { useUsers } from '../hooks/useUsers';

function UserList() {
  const { users, loadingUsers, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loadingUsers) return <Spinner />;

  return (
    <Box>
      {users?.map(user => <UserCard key={user.id} user={user} />)}
    </Box>
  );
}
```

### Example 3: Strategy Edit Component

**Before:**
```javascript
const handleSubmit = async () => {
  try {
    await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategy/${strategyid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwttoken}`,
      },
      body: JSON.stringify(updatedFields),
    });
    toast({ title: 'Strategy updated successfully.' });
  } catch (error) {
    toast({ title: 'Failed to update strategy.' });
  }
};
```

**After:**
```javascript
import { useStrategies } from '../hooks/useStrategies';

function StrategyEdit() {
  const { updateStrategy, updating } = useStrategies();

  const handleSubmit = useCallback(async () => {
    await updateStrategy(strategyid, updatedFields);
  }, [strategyid, updatedFields, updateStrategy]);

  return (
    <Button onClick={handleSubmit} isLoading={updating}>
      Update Strategy
    </Button>
  );
}
```

---

## 4. Migration Checklist

### For Each Component:

- [ ] Import API service instead of using fetch
- [ ] Replace fetch calls with service methods
- [ ] Use useApi hook for state management
- [ ] Remove manual loading/error state
- [ ] Remove manual toast notifications
- [ ] Add AbortController support (automatic with useApi)
- [ ] Remove JWT token access (handled by interceptor)
- [ ] Test all API calls
- [ ] Update tests

---

## 5. Benefits

### Code Quality
- ✅ Single source of truth for API endpoints
- ✅ Consistent error handling
- ✅ Automatic request cancellation
- ✅ Type safety (with TypeScript)
- ✅ Easy to mock for testing

### Performance
- ✅ Automatic request deduplication
- ✅ Request cancellation on unmount
- ✅ Optimized re-renders with hooks

### Developer Experience
- ✅ Autocomplete for API methods
- ✅ Clear API documentation
- ✅ Easy to add new endpoints
- ✅ Consistent patterns across app

### Maintainability
- ✅ Easy to update endpoints
- ✅ Centralized interceptors
- ✅ Easy to add features (retry, caching)
- ✅ Clear separation of concerns

---

## 6. Next Steps

1. **Implement base client** (2-3 hours)
2. **Create endpoint constants** (1-2 hours)
3. **Implement service modules** (8-12 hours)
4. **Create custom hooks** (6-8 hours)
5. **Migrate components** (20-30 hours)
6. **Add tests** (10-15 hours)
7. **Documentation** (3-4 hours)

**Total Estimated Effort: 50-75 hours (~1.5-2 weeks)**

