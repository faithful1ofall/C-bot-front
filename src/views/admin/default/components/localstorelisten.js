import { useState, useEffect } from 'react';

const useLocalStorageStrategies = (key) => {
  const [strategies, setStrategies] = useState(() => {
    // Initial fetch from localStorage and parse as an array
    const savedStrategies = localStorage.getItem(key);
    return savedStrategies ? JSON.parse(savedStrategies) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      // Parse the updated value from localStorage
      const updatedStrategies = localStorage.getItem(key);
      setStrategies(updatedStrategies ? JSON.parse(updatedStrategies) : []);
    };

    // Listen for 'storage' event for cross-tab updates
    window.addEventListener('storage', handleStorageChange);

    // Custom event for single-tab updates
    window.addEventListener('strategiesUpdate', handleStorageChange);

    // Cleanup listeners on component unmount
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

  // Return the parsed array and the update function
  return [strategies, updateStrategies];
};

export default useLocalStorageStrategies;