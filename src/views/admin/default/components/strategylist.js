// StrategiesList.js
import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Divider,
  Button,
  Icon,
  IconButton,
  SimpleGrid,
  Switch,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MdAddAlert, MdEdit, MdDelete } from 'react-icons/md';
import { useNavigate, NavLink } from 'react-router-dom';
import StrategyDeleteConfirmationModal from './strategydelete';

const StrategiesList = () => {

    const toast = useToast();
    const navigate = useNavigate();

    const jwttoken = localStorage.getItem('jwtToken');

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
      } = useDisclosure();

      const [strategies, setStrategies] = useState([]);
      const [strategyedit, SetStrategyEdit] = useState(false);

       // Function to handle navigation and setting local storage
  const handleEditStrategy = (strategyId) => {
    // Set local storage items
    localStorage.setItem("strategyid", strategyId);    
    // Navigate to the edit route
    navigate(`/admin/edit`);
  };

  const fetchStrategies = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/strategies`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwttoken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse the JSON response
      setStrategies(data);
      const activestrategies = data.filter((strategy) => strategy.active).length;
      localStorage.setItem("botstrategies", data);
      localStorage.setItem("activestrategies", activestrategies);
    } catch (err) {
      console.error(err.message);
    }
  }, [jwttoken]);

  useEffect(() => {
    fetchStrategies();
  }, [
    fetchStrategies
  ]);


  const handleactive = async (strategyIdd, currentstatus) => {
    const activate = {
      active: !currentstatus,
    };

    try {
      await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/strategy/${strategyIdd}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwttoken}`,
          },
          body: JSON.stringify(activate),
        },
      );
      if (!currentstatus) {
        toast({
          title: 'Strategy actived successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Strategy deactived successfully.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to activate strategy.',
        description: 'Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Request failed', error);
    }

    await fetchStrategies();
    console.log('activate Update', activate);
  };





  return (
    <Box mt={5} position="relative" textAlign="left">
      <Text as="span" zIndex={1} fontSize="2xl" fontWeight="bold">
        STRATEGIES
      </Text>
      <Divider mt={-1} borderColor="black.400" borderWidth="1px" />

      <Button
        as={NavLink}
        to="/admin/create"
        mt="20px"
        leftIcon={<Icon as={MdAddAlert} />}
        colorScheme="blue"
      >
        Create Strategy
      </Button>

      <SimpleGrid
        mt="20px"
        columns={{ base: 1, md: 2, lg: 3, '2xl': 3 }}
        gap="20px"
      >
        {strategies.map((strategy) => (
          <Box key={strategy.id} p="5" shadow="md" borderWidth="1px" borderRadius="md">
            <Flex align="center" justify="space-between">
              <Text fontWeight="bold">{strategy.name}</Text>

              <Switch
                ml="auto"
                isChecked={strategy.active}
                onChange={() => handleactive(strategy.id, strategy.active)}
                colorScheme="teal"
              />
            </Flex>

                  <Flex mt={4} align="left" justify="flex-start">
  <IconButton
    icon={<MdEdit />}
    colorScheme="blue"
    aria-label="Edit strategy"
    variant="ghost"
    onClick={() => handleEditStrategy(strategy.id)}
    size="sm"
  />

  <Divider orientation="vertical" mx={2} height="20px" borderColor="gray.300" />

  <IconButton
    icon={<MdDelete />}
    colorScheme="red"
    aria-label="Delete strategy"
    variant="ghost"
    onClick={() => {
      onDeleteOpen();
      SetStrategyEdit(strategy);
    }}
    size="sm"
  />
</Flex>

            
            {isDeleteOpen && (
              <StrategyDeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                strategyname={strategyedit?.name}
                todelete={strategyedit?.id}
                jwttoken={jwttoken}
              />
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default StrategiesList;
