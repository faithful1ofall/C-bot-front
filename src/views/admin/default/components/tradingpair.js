import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Menu, MenuButton, MenuList, Input, InputGroup, InputLeftElement, Checkbox, Stack, CheckboxGroup, SimpleGrid, Text } from "@chakra-ui/react";
import { MdPerson, MdSearch } from "react-icons/md";

const TradingPairs = React.memo(() => {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryvalue, setSearchQueryvalue] = useState('');
  const [searchHistory, setSearchHistory] = useState([]); 
  const [selectedPairs, setSelectedPairs] = useState([]);  
  const [selectedTradingPairs1, setSelectedTradingPairs1] = useState([]);

  const fetchPairs = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/saved-trading-pairs`,
      ); // Adjust the URL based on your backend setup
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse the JSON response
      setSelectedTradingPairs1(data.data);
      console.log(data.data);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  const filteredPairs = selectedTradingPairs1.filter((pair) =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredSelectedPairs = selectedTradingPairs1
  .filter((pair) => pair.isSelected === 'true') // Filter pairs where isSelected is "true"
  .map((pair) => pair.symbol); // Map to get only the symbols

  useEffect(() => {
    fetchPairs();
  }, [ fetchPairs]);

  useEffect(() => {
    setSelectedPairs(filteredSelectedPairs);
    localStorage.setItem("selectpairs", filteredSelectedPairs);
  }, [filteredSelectedPairs]);

  // Handle search query change
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQueryvalue(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(e.target.value);

      // Add the current query to the search history if it's not empty
      if (searchQuery.trim()) {
        setSearchHistory((prevHistory) => [
          searchQuery,
          ...prevHistory.slice(0, 3),
        ]); // Add new search and limit to 4
      }
    }
  };

  const handleSelectPair = async (selectedValues, selectedbool) => {
    const boolSelected = selectedbool === 'true';

    console.log('id', selectedValues, !boolSelected);

    const selbool = {
      isSelected: !boolSelected,
    };
    try {
      // Send a PUT request to update the selected trading pairs on the server
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/trading-pairs/${selectedValues}/select`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selbool),
        },
      );

      if (!response.ok) {
        console.log(response);
        throw new Error('Error selecting trading pairs');
      }

      const data = await response.json();

      console.log('Selected trading pairs updated successfully:', data);
      await fetchPairs();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
  <Box>
    <Menu>
      <MenuButton mt={5} as={Button} leftIcon={<MdPerson />} colorScheme="teal">
        Add Trading Pairs
      </MenuButton>
      <MenuList p={4} width="300px">
        <InputGroup mb={4}>
          <InputLeftElement pointerEvents="none" children={<MdSearch color="gray.300" />} /> 
          <Input
              placeholder="Search trading pairs"
              value={searchQueryvalue}
              onChange={handleSearch}
              onKeyDown={handleKeyPress}
            />
        </InputGroup>
        {searchHistory.length > 0 && (
          <Box mb={4}>
            <strong>Recent Searches:</strong>
            <SimpleGrid columns={2} spacing={2}>
              {searchHistory.slice(0, 4).map((query, index) => (
                <Button key={index} variant="link" onClick={() => setSearchQuery(query)}>
                  {query}
                </Button>
              ))}
            </SimpleGrid>
          </Box>
        )}
        <CheckboxGroup value={selectedPairs}>
          <Stack spacing={3}>
            {filteredPairs.map((pair) => (
              <Checkbox key={pair._id} value={pair.symbol} onChange={() => handleSelectPair(pair._id, pair.isSelected)}>
                {pair.symbol}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </MenuList>
    </Menu>
    <Box mt={4}>
      <Text fontWeight="bold" mb={2}>Added Trading Pairs:</Text>
      {selectedPairs.length > 0 ? (
        <Stack spacing={2}>
          {selectedPairs.map((pair) => (
            <Text key={pair} p={2} borderWidth="1px" borderRadius="md" borderColor="gray.200">
              {pair}
            </Text>
          ))}
        </Stack>
      ) : (
        <Text color="gray.500">No trading pairs added.</Text>
      )}
    </Box>
  </Box>
  );
});

export default TradingPairs;