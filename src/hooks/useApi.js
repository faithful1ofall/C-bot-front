import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

export const useApi = (apiFunction, options = {}) => {
  const {
    immediate = false,
    onSuccess,
    onError,
    successMessage,
    errorMessage,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const toast = useToast();

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      abortControllerRef.current = new AbortController();

      try {
        const result = await apiFunction(...args, abortControllerRef.current.signal);
        setData(result);

        if (successMessage) {
          toast({
            title: successMessage,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        if (err.cancelled) {
          return;
        }

        setError(err);

        if (errorMessage) {
          toast({
            title: errorMessage,
            description: err.message,
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
    [apiFunction, onSuccess, onError, successMessage, errorMessage, toast]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, execute]);

  return { data, loading, error, execute };
};

export const useAuth = () => {
  const navigate = useNavigate();

  const checkTokenExpiry = useCallback(() => {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
      return false;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);
      const currentTime = Date.now() / 1000;

      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken');
    navigate('/auth/sign-in', { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!checkTokenExpiry()) {
      logout();
    }
  }, [checkTokenExpiry, logout]);

  return { checkTokenExpiry, logout };
};
