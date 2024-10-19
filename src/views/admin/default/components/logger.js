import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  useColorModeValue,
  VStack,
  Spinner,
} from '@chakra-ui/react';

const Logger = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  // Simulating a WebSocket connection or API call to fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/logs'); // Replace with your API endpoint
        const data = await response.json();
        setLogs(data.logs); // Assuming your API returns logs in this format
      } catch (err) {
        setError('Error fetching logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();

    // Optional: Setup a WebSocket connection for live updates
     const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET); // Replace with your WebSocket URL
    socket.onmessage = (event) => {
      const newLog = event.data;
      setLogs((prevLogs) => [...prevLogs, newLog]);
    }; 

    return () => {
      socket.close();
    }; 
  }, []);

  return (
    <Box
      p={4}
      bg={useColorModeValue('gray.50', 'gray.800')}
      borderRadius="lg"
      boxShadow="md"
      maxHeight="400px"
      overflowY="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={4}>
        Logger
      </Text>
      {loading && (
        <Flex justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      )}
      {error && (
        <Text color="red.400" mb={4}>
          {error}
        </Text>
      )}
      <VStack spacing={2} align="start">
        {logs.map((log, index) => (
          <Text key={index} color={textColor} fontSize="sm">
            {log}
          </Text>
        ))}
      </VStack>
      <Button mt={4} onClick={() => setLogs([])} colorScheme="red">
        Clear Logs
      </Button>
    </Box>
  );
};

export default Logger;