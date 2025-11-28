import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Input,
  InputGroup,
  InputLeftElement,
  Checkbox,
  Stack,
  CheckboxGroup,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { MdPerson, MdSearch } from 'react-icons/md';
import apiService from 'services/api';

const TradingPairs = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryvalue, setSearchQueryvalue] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [selectedTradingPairs1, setSelectedTradingPairs1] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const fetchPairs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getSavedTradingPairs();
      setSelectedTradingPairs1(data.data);
    } catch (err) {
      console.error('Error fetching pairs:', err);
      toast({
        title: 'Error loading trading pairs',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const filteredPairs = selectedTradingPairs1.filter((pair) =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSelectedPairs = selectedTradingPairs1
    .filter((pair) => pair.isSelected === 'true')
    .map((pair) => pair.symbol);

  useEffect(() => {
    fetchPairs();
  }, [fetchPairs]);

  useEffect(() => {
    setSelectedPairs(filteredSelectedPairs);
    localStorage.setItem('selectpairs', filteredSelectedPairs);
  }, [filteredSelectedPairs]);

  const handleSearch = useCallback((event) => {
    setSearchQueryvalue(event.target.value);
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        setSearchQuery(e.target.value);

        if (searchQuery.trim()) {
          setSearchHistory((prevHistory) => [
            searchQuery,
            ...prevHistory.slice(0, 3),
          ]);
        }
      }
    },
    [searchQuery]
  );

  const handleSelectPair = useCallback(
    async (selectedValues, selectedbool) => {
      const boolSelected = selectedbool === 'true';

      try {
        await apiService.updateTradingPairSelection(
          selectedValues,
          !boolSelected
        );

        toast({
          title: 'Trading pair updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        await fetchPairs();
      } catch (error) {
        toast({
          title: 'Error updating trading pair',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [fetchPairs, toast]
  );
  return (
    <Box>
      <Menu>
        <MenuButton
          mt={5}
          as={Button}
          leftIcon={<MdPerson />}
          colorScheme="teal"
          isLoading={isLoading}
        >
          Add Trading Pairs
        </MenuButton>
        <MenuList p={4} width="300px">
          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none">
              <MdSearch color="gray.300" />
            </InputLeftElement>
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
                  <Button
                    key={index}
                    variant="link"
                    onClick={() => setSearchQuery(query)}
                  >
                    {query}
                  </Button>
                ))}
              </SimpleGrid>
            </Box>
          )}
          <CheckboxGroup value={selectedPairs}>
            <Stack spacing={3}>
              {filteredPairs.map((pair) => (
                <Checkbox
                  key={pair._id}
                  value={pair.symbol}
                  onChange={() => handleSelectPair(pair._id, pair.isSelected)}
                >
                  {pair.symbol}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </MenuList>
      </Menu>
      <Box mt={4}>
        <Text fontWeight="bold" mb={2}>
          Added Trading Pairs:
        </Text>
        {selectedPairs.length > 0 ? (
          <Stack spacing={2}>
            {selectedPairs.map((pair) => (
              <Text
                key={pair}
                p={2}
                borderWidth="1px"
                borderRadius="md"
                borderColor="gray.200"
              >
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