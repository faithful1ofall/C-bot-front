import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const [page, setPage] = useState(1); // Page counter for pagination
  const [hasMore, setHasMore] = useState(true); // To track if there are more logs to load
  const observerRef = useRef(); // Ref for the observer
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const jwttoken = localStorage.getItem("jwtToken");
  const isMainWindow = window.location.pathname.includes('/admin/logger')

  console.log("isMainWindow", isMainWindow);

  // Fetch logs based on the page
  const fetchLogs = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/logs?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwttoken}`,
        }
      });
      const data = await response.json();
      console.log('datalogs api', data.logs);

      setLogs((prevLogs) => [...prevLogs, ...data.logs]);
      setHasMore(data.logs.length > 0); // Check if there are more logs to load
    } catch (err) {
      setError('Error fetching logs');
    } finally {
      setLoading(false);
    }
  }, [jwttoken]);

  useEffect(() => {
    // Fetch the initial set of logs
    fetchLogs(page);
  }, [page, jwttoken, fetchLogs]);

  // Observer callback to load more logs when scrolled to bottom
  const lastLogRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // Load next page
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  const openLoggerInNewTab = () => {
    window.open('/admin/logger', '_blank', 'noopener,noreferrer');
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp) {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(date);
    }
  };

  return (
    <Box
      p={4}
      mt={12}
      bg={useColorModeValue('gray.50', 'gray.800')}
      borderRadius="lg"
      boxShadow="md"
      maxHeight="400px"
      overflowY="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={2}>
        Activity Logs
      </Text>
      {!isMainWindow && (
      <Button mb={2} onClick={() => openLoggerInNewTab()} colorScheme="blue">
        Open in New Tab
      </Button>
      )}
      {error && (
        <Text color="red.400" mb={4}>
          {error}
        </Text>
      )}
      <VStack spacing={2} align="start">
        {logs.map((log, index) => {
          // Attach ref to the last log for infinite scrolling
          const isLastLog = logs.length === index + 1;
          return (
            <Text
              ref={isLastLog ? lastLogRef : null}
              key={index}
              color={textColor}
              fontSize="sm"
            >
              <strong>{formatTimestamp(log.timestamp)}:</strong> {log.message}
            </Text>
          );
        })}
      </VStack>
      {loading && (
        <Flex justifyContent="center" alignItems="center" mt={4}>
          <Spinner />
        </Flex>
      )}
    </Box>
  );
};

export default Logger;