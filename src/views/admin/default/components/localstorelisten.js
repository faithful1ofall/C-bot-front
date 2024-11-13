import { useState, useEffect } from 'react';

const useLocalStorageStrategies = (key) => {
  const [strategies, setStrategies] = useState(() => {
    // Initial fetch from localStorage
    const savedStrategies = localStorage.getItem(key);
    return savedStrategies ? JSON.parse(savedStrategies) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedStrategies = localStorage.getItem(key);
      if (updatedStrategies) {
        setStrategies(JSON.parse(updatedStrategies));
      }
    };

    // Listen for changes in localStorage (also works across tabs)
    window.addEventListener('storage', handleStorageChange);

    // For single-tab updates, use a custom event
    window.addEventListener('strategiesUpdate', handleStorageChange);

    // Cleanup listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('strategiesUpdate', handleStorageChange);
    };
  }, [key]);

  // Function to update localStorage and trigger the custom event
  const updateStrategies = (newStrategies) => {
    localStorage.setItem(key, JSON.stringify(newStrategies));
    window.dispatchEvent(new Event('strategiesUpdate'));
  };

  return [strategies, updateStrategies];
};

export default useLocalStorageStrategies;
