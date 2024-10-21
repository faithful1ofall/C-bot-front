// Chakra import
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Icon,
  IconButton,
  InputLeftElement,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  Text,
  useToast,
  useColorModeValue,
  useDisclosure,
  Switch,
} from '@chakra-ui/react';
// Custom components
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

import {
  MdAttachMoney,
  MdAutorenew,
  MdShowChart,
  MdCheckCircle,
  MdPerson,
  MdAddAlert,
  MdMoreVert,
  MdMonetizationOn,
  MdSearch,
} from 'react-icons/md';
import GeneralExchangeSettingsModal from './components/usersettings';
import TransferModal from './components/Transfer';
import TradePositionTable from './components/PositionsTable';
import TradeHistoryTable from './components/Tradehistory';
// import Logger from './components/logger';
import CreateStrategyModal from './components/createstrategy';
import EditStrategyForm from './components/editstrategy';
import TradingHookTriggerModal from './components/tradehook';
import StrategyDeleteConfirmationModal from './components/strategydelete';
import UserDeleteConfirmationModal from './components/userdelete';
import UserModal from './components/adduser';

export default function UserReports() {
  const toast = useToast();
  const navigate = useNavigate();

  const jwttoken = localStorage.getItem('jwtToken');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryvalue, setSearchQueryvalue] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [selectedTradingPairs1, setSelectedTradingPairs1] = useState([]);

  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
  const [isLinkStrategyOpen, setLinkStrategyOpen] = useState(false);
  const [expandedStrategyId, setExpandedStrategyId] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState('');


  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen1,
    onOpen: onDeleteOpen1,
    onClose: onDeleteClose1,
  } = useDisclosure();

  const {
    isOpen: isUserOpen,
    onOpen: onUserOpen,
    onClose: onUserClose,
  } = useDisclosure();
  const {
    isOpen: isTransferOpen,
    onOpen: onTransferOpen,
    onClose: onTransferClose,
  } = useDisclosure();
  const {
    isOpen: isCreateStrategyOpen,
    onOpen: onCreateStrategyOpen,
    onClose: onCreateStrategyClose,
  } = useDisclosure();
  const {
    isOpen: isTradingHookTriggerOpen,
    onOpen: onTradingHookTriggerOpen,
    onClose: onTradingHookTriggerClose,
  } = useDisclosure();

  // Chakra Color Mode
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const [users, setUsers] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState([]);
  const [selectedStrategyIds, setSelectedStrategyIds] = useState([]);
  const [transferuserid, setTransferUserId] = useState('');

  // new parameters

  const [useredit, SetUserEdit] = useState(false);

  const [olduser, setOldUser] = useState(null);

  const [accountinfo, setAccountinfo] = useState(0);

 // const tradingViewLink = `${process.env.REACT_APP_BACKENDAPI}/api/tradingview-webhook`;
  const [positions, setPositions] = useState([]); // Your trade positions data
  const [positionshistory, setPositionsHistory] = useState([]); // Your trade positions data

  const fetchPositionhistory = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/binance/all-past-trades`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwttoken}`, // Attach the token
          },
        },
      );

      const data = await response.json(); // Parse the JSON response

      if (!response.ok) {
        console.log('positions error data', data);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPositionsHistory(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }, [jwttoken]);

  const fetchPosition = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/binance/all-open-positions`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwttoken}`, // Attach the token
          },
        },
      );

      const data = await response.json(); // Parse the JSON response

      if (!response.ok) {
        console.log('positions error data', data);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPositions(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }, [jwttoken]);

  const handleClosePosition = async (position) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/binance/close-position/${position.userId}/${position.symbol}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwttoken}`, // Attach the token
          },
        },
      );

      const data = await response.json(); // Parse the JSON response

      if (!response.ok) {
        console.log('Closed positions error data', data);
        toast({
          title: 'Error closing trade.',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(data, 'closed position success');
      toast({
        title: 'Trade closed successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchPosition();
    } catch (err) {
      toast({
        title: 'Error closing trade.',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error(err, 'close posiotn error');
    }
  };

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

  // Handle search query change
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQueryvalue(query);
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

  const fetchAccountinfo = async (accuserid, assetpass) => {
    const assetfind = 'USDT' || assetpass;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/binance/account-info/${accuserid}/${assetfind}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwttoken}`,
          },
        },
      );
      if (!response.ok) {
        const error = await response.json();
        return error.message.msg;
      }
      const data = await response.json(); // Parse the JSON response
      setAccountinfo(data);
      return data;
    } catch (err) {
      console.error(err.message);
      return err.message;
    }
  };

  const fetchtradeinfo = async (usid) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/binance/valid/${usid}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwttoken}`,
          },
        },
      );
      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        toast({
          title: 'Error',
          description: `There was an issue fetching Validation info. ${JSON.stringify(error.message)}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

      const { data } = await response.json(); // Parse the JSON response
      // Display enabled permissions
      const permissions = {
        Reading: data.enableReading,
        Futures: data.enableFutures,
        UniversalTransfer: data.permitsUniversalTransfer,
      };

      console.log('User Permissions:', permissions);

      // Generate success message based on enabled permissions
      const enabledPermissions = Object.entries(permissions)
        .filter(([_, value]) => value)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase());

      // If any permissions are enabled, show the success message
      if (enabledPermissions.length > 0) {
        const formattedPermissions =
          enabledPermissions.length > 2
            ? `${enabledPermissions.slice(0, -1).join(', ')} and ${enabledPermissions.slice(-1)}`
            : enabledPermissions.join(' and ');

        toast({
          title: 'API Successfully Validated!',
          description: `${formattedPermissions} enabled.`,
          status: 'success',
          duration: 7000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching Validation info:', error);
    }
  };

  const fetchapiinfo = async (usid) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/binance/all-exchange-info/${usid}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwttoken}`,
          },
        },
      );
      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        toast({
          title: 'Error',
          description: `There was an issue fetching API info. ${JSON.stringify(error.message)}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

      const { exchangeInfo } = await response.json(); // Parse the JSON response

      console.log('User api info data:', exchangeInfo);

      // Display enabled permissions
      const permissions = {
        limit: exchangeInfo[0].exchangeInfo[0].limit,
        usedlimit: exchangeInfo[0].headersInfo.usedIPWeight1M,
      };

      console.log('User Permissions:', permissions);

      // Generate success message based on enabled permissions
      const enabledPermissions = Object.entries(permissions)
        .filter(([_, value]) => value)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase());

      // If any permissions are enabled, show the success message
      if (enabledPermissions.length > 0) {
        toast({
          title: 'IP Limit Used and Total Per minute(1 minute)',
          description: `${permissions.usedlimit}/${permissions.limit} per-minute.`,
          status: 'success',
          duration: 7000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching API info:', error);
    }
  };

  const filteredPairs = selectedTradingPairs1.filter((pair) =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredSelectedPairs = selectedTradingPairs1
    .filter((pair) => pair.isSelected === 'true') // Filter pairs where isSelected is "true"
    .map((pair) => pair.symbol); // Map to get only the symbols

  // Handle pair selection
  const handleSelectPairs = () => {
    setSelectedPairs(filteredSelectedPairs);
  };

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/users`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwttoken}`, // Attach the token
          },
        },
      );

      const data = await response.json(); // Parse the JSON response

      if (!response.ok) {
        console.log(data, jwttoken);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUsers(data);
      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  }, [jwttoken]);

  const deleteuser = async (id) => {
    console.log('user id', id);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/users/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${jwttoken}`, // Attach the token
          },
        },
      );

      if (response.ok) {
        toast({
          title: 'User deleted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchUsers();
        onDeleteClose1();
      } else {
        toast({
          title: 'Error deleting user.',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Failed to delete User');
      }
    } catch (error) {
      toast({
        title: 'Error deleting user.',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error deleting User:', error);
    }
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
    } catch (err) {
      console.error(err.message);
    }
  }, [jwttoken]);

  const deleteStrategy = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/strategies/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${jwttoken}`,
          },
        },
      );
      if (response.ok) {
        toast({
          title: 'Strategy deleted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onDeleteClose();
        fetchStrategies();
        fetchUsers();
      } else {
        toast({
          title: 'Error deleting strategy.',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Failed to delete strategy');
      }
    } catch (error) {
      toast({
        title: 'Error deleting strategy.',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error deleting strategy:', error);
    }
  };

  useEffect(() => {
    const isTokenExpired = (token) => {
      const base64Url = token.split('.')[1]; // Get payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );

      const decoded = JSON.parse(jsonPayload);
      const currentTime = Date.now() / 1000;

      console.log('decoded', decoded.exp, currentTime);
      return decoded.exp <= currentTime;
    };

    if (isTokenExpired(jwttoken)) {
      navigate('/auth/sign-in');
      console.log('Token has expired');
    }

    if (!jwttoken) {
      navigate('/auth/sign-in');
      console.error('No JWT token found');
    }
  }, [jwttoken, navigate]);

  useEffect(() => {
    fetchUsers();
    fetchStrategies();
    fetchPairs();
    fetchPosition();
    fetchPositionhistory();
  }, [
    fetchPositionhistory,
    fetchPosition,
    fetchUsers,
    fetchStrategies,
    fetchPairs,
  ]);

  useEffect(() => {
    setSelectedPairs(filteredSelectedPairs);
  }, [filteredSelectedPairs]);

  const tradinghook = async () => {
    const hooking = {
      strategy: selectedStrategy,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/tradingview-webhook`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(hooking),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'Error initiating trade hook.',
          description: `Trade not executed, info: ${errorData.error}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw new Error(errorData.error || 'Error initiating trade hook.');
      }

      const data = await response.json();
      console.log('hooking', data);

      // Fetch updated position data
      await fetchPosition();

      toast({
        title: 'Trade hook successful.',
        description: `Trade executed successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error initiating trade hook.',
        description: error.error || 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Request failed', error);
    }
  };


  const handleuseractive = async (userIdd, currentstatus) => {
    const activate = {
      active: !currentstatus,
    };

    try {
      await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users/${userIdd}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwttoken}`,
        },
        body: JSON.stringify(activate),
      });

      if (!currentstatus) {
        toast({
          title: 'User activated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'User deactivated successfully.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      await fetchUsers();
    } catch (error) {
      toast({
        title: 'Error activating user.',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Request failed', error);
    }

    console.log('User activate Update', activate);
  };

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

  

  const handleEditUser = async (editid) => {
    try {
      const response1 = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/users/${editid}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwttoken}`,
          },
        },
      );

      if (!response1.ok) {
        toast({
          title: 'Error updating user details.',
          description: 'Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw new Error(`HTTP error! status: ${response1.status}`);
      }
      const data1 = await response1.json();
      setOldUser(data1);
    } catch (error) {
      toast({
        title: 'Error updating user details.',
        description: 'Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Request failed', error);
    }
  };

  const handleLinkStrategyToUser = async (userId, strategyid, boole) => {
    if (boole) {
      try {
        await fetch(
          `${process.env.REACT_APP_BACKENDAPI}/api/users/${userId}/strategies/${strategyid}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${jwttoken}`,
            },
          },
        );
        toast({
          title: 'Strategy unlinked from user successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error unlinking strategy from user.',
          description: 'Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Error:', error);
      }
      fetchUsers();

      const updatedStrategyIds = selectedStrategyIds.filter(
        (id) => id !== strategyid,
      );

      // Set the new array as the state
      setSelectedStrategyIds(updatedStrategyIds);
    } else {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKENDAPI}/api/users/${userId}/strategies/${strategyid}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwttoken}`,
            },
          },
        );

        const data = await response.json();
        console.log('linking', data);

        if (response.ok) {
          toast({
            title: 'Strategy linked to user successfully.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          fetchUsers();

          const updatedStrategyIds = [...selectedStrategyIds, strategyid];

          // Set the new array as the state
          setSelectedStrategyIds(updatedStrategyIds);
        } else {
          toast({
            title: 'Error linking strategy to user.',
            description: 'Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          console.error('Error adding user:', data.error);
        }
      } catch (error) {
        toast({
          title: 'Error linking strategy to user.',
          description: 'Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Error:', error);
      }
    }
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

  return (
    <Box pt={{ base: '40px', md: '80px', xl: '80px' }}>
      <Box mt={15} position="relative" textAlign="left">
        <Text as="span" zIndex={1} fontSize="2xl" fontWeight="bold">
          INFO
        </Text>
        <Divider
          mt={-1} // Move the divider up to align with the text
          borderColor="black.400"
          borderWidth="1px"
        />
      </Box>
      <SimpleGrid
        columns={{ base: 2, lg: 2 }} // Ensures 2 columns even on small screens
        gap="20px"
        mb="10px"
        mt={5}
      >
        <MiniStatistics
          startContent={
            <IconBox
              w={{ base: '48px', md: '56px' }} // Responsive width
              h={{ base: '48px', md: '56px' }} // Responsive height
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={
                <Icon
                  w={{ base: '24px', md: '28px' }}
                  h={{ base: '24px', md: '28px' }}
                  as={MdPerson}
                  color="white"
                />
              }
            />
          }
          name="Total users"
          value={users.length}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w={{ base: '48px', md: '56px' }}
              h={{ base: '48px', md: '56px' }}
              bg={boxBg}
              icon={
                <Icon
                  w={{ base: '28px', md: '32px' }}
                  h={{ base: '28px', md: '32px' }}
                  as={MdAttachMoney}
                  color={brandColor}
                />
              }
            />
          }
          name="Active users"
          value={users.filter((user) => user.active).length}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w={{ base: '48px', md: '56px' }}
              h={{ base: '48px', md: '56px' }}
              bg={boxBg}
              icon={
                <Icon
                  w={{ base: '28px', md: '32px' }}
                  h={{ base: '28px', md: '32px' }}
                  as={MdAutorenew}
                  color={brandColor}
                />
              }
            />
          }
          name="Active trade(s)"
          value={positions?.positions?.length || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w={{ base: '48px', md: '56px' }}
              h={{ base: '48px', md: '56px' }}
              bg={boxBg}
              icon={
                <Icon
                  w={{ base: '28px', md: '32px' }}
                  h={{ base: '28px', md: '32px' }}
                  as={MdShowChart}
                  color={brandColor}
                />
              }
            />
          }
          name="Total strategies"
          value={strategies.length}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w={{ base: '48px', md: '56px' }}
              h={{ base: '48px', md: '56px' }}
              bg={boxBg}
              icon={
                <Icon
                  w={{ base: '28px', md: '32px' }}
                  h={{ base: '28px', md: '32px' }}
                  as={MdCheckCircle}
                  color={brandColor}
                />
              }
            />
          }
          name="Active strategies"
          value={strategies.filter((strategy) => strategy.active).length}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w={{ base: '48px', md: '56px' }}
              h={{ base: '48px', md: '56px' }}
              bg={boxBg}
              icon={
                <Icon
                  w={{ base: '28px', md: '32px' }}
                  h={{ base: '28px', md: '32px' }}
                  as={MdMonetizationOn}
                  color={brandColor}
                />
              }
            />
          }
          name="Total ROI"
          value="0"
        />
      </SimpleGrid>

      <Box mt={5} position="relative" textAlign="left">
        <Text as="span" zIndex={1} fontSize="2xl" fontWeight="bold">
          PAIRS
        </Text>
        <Divider
          mt={-1} // Move the divider up to align with the text
          borderColor="black.400"
          borderWidth="1px"
        />
      </Box>

      
      <Menu>
        <MenuButton
          mt={5}
          as={Button}
          leftIcon={<Icon as={MdPerson} />}
          colorScheme="teal"
        >
          Add Trading Pairs
        </MenuButton>

        <MenuList p={4} width="300px">
          
          <InputGroup mb={4}>
            <InputLeftElement
              pointerEvents="none"
              children={<Icon as={MdSearch} color="gray.300" />}
            />
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

         
          <CheckboxGroup value={selectedPairs} onChange={handleSelectPairs}>
            <Stack spacing={3}>
              {filteredPairs.map((pair) => (
                <Checkbox
                  key={pair._id}
                  value={pair.symbol}
                  isChecked={pair.isSelected}
                  onChange={() => {
                    handleSelectPair(pair._id, pair.isSelected);
                  }}
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

      <Box mt={5} position="relative" textAlign="left">
        <Text as="span" zIndex={1} fontSize="2xl" fontWeight="bold">
          USERS
        </Text>
        <Divider
          mt={-1} // Move the divider up to align with the text
          borderColor="black.400"
          borderWidth="1px"
        />
      </Box>

      <Flex justify="space-between" mt="20px">
        <Button
          leftIcon={<Icon as={MdPerson} />}
          colorScheme="teal"
          onClick={() => {
            SetUserEdit('');
            onUserOpen();
          }}
        >
          Add User
        </Button>
        <Button
          leftIcon={<Icon as={MdPerson} />}
          colorScheme="teal"
          onClick={onTradingHookTriggerOpen}
        >
          Test Webhook
        </Button>
      </Flex>

    {isTradingHookTriggerOpen && (
      <TradingHookTriggerModal
        isOpen={isTradingHookTriggerOpen}
        onClose={onTradingHookTriggerClose}
        strategies={strategies}
      />
    )}
      

      {isDeleteOpen1 && (
        <UserDeleteConfirmationModal
          isOpen={isDeleteOpen1}
          onClose={onDeleteClose1}
          deleteuser={deleteuser}
          useredit={useredit}
        />
      )}

      {isUserOpen && (
        <UserModal
          isOpen={isUserOpen}
          onClose={onUserClose}
          jwttoken={jwttoken}
          useredit={useredit}
        />
      )}

      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 3 }}
        gap="20px"
        mt="40px"
      >
        {users.map((user, index) => (
          <Box
            key={`${user._id}`}
            p="5"
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
          >
            <Flex align="center" justify="space-between">
              <Avatar src="https://bit.ly/dan-abramov" />
              <Menu>
                <MenuButton as={IconButton} icon={<MdMoreVert />} />
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setSelectedStrategyId(user.id);
                      setSelectedStrategyIds(
                        user.strategyIds.map(
                          (id) => strategies.find((s) => s.id === id)?.id,
                        ),
                      );
                      setLinkStrategyOpen((prev) =>
                        prev === user.id ? null : user.id,
                      );
                    }}
                  >
                    Link Strategies
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      fetchAccountinfo(user.id);
                      setTransferUserId(user.id);
                      setIsGeneralSettingsOpen((prev) =>
                        prev === user.id ? null : user.id,
                      );
                    }}
                  >
                    User/Exchange Settings
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      fetchAccountinfo(user.id);
                      setTransferUserId(user.id);
                      onTransferOpen((prev) =>
                        prev === user.id ? null : user.id,
                      );
                    }}
                  >
                    Internal Transfer
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      SetUserEdit(user.id);
                      handleEditUser(user.id);
                      onUserOpen();
                    }}
                  >
                    Edit User
                  </MenuItem>
                  <MenuItem onClick={() => fetchtradeinfo(user.id)}>
                    Validate API connection
                  </MenuItem>
                  <MenuItem onClick={() => fetchapiinfo(user.id)}>
                    {' '}
                    API IP Limit{' '}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      SetUserEdit(user.id);
                      onDeleteOpen1();
                    }}
                  >
                    Delete User
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <Switch
              isChecked={user?.active}
              onChange={() => handleuseractive(user.id, user.active)}
              colorScheme="teal"
            />

            <Box mt="4">
              <Text>User Name: {user?.name}</Text>
              <Text>
                Strategies:{' '}
                {user.strategyIds
                  .map(
                    (id) => strategies.find((s) => s.id === id)?.name || 'None',
                  )
                  .join(', ')}
              </Text>
            </Box>

            {isGeneralSettingsOpen === user.id && (
              <Box mt="4" bg="gray.50" p="4" borderRadius="md">
                <GeneralExchangeSettingsModal
                  userid={transferuserid}
                  balance={accountinfo}
                />
              </Box>
            )}

            {isLinkStrategyOpen === user.id && (
              <Box mt="4" bg="gray.50" p="4" borderRadius="md">
                <FormControl>
                  <FormLabel>Select Strategies to Link</FormLabel>
                  <SimpleGrid mt="20px" columns={{ base: 1 }} gap="20px">
                    {strategies.map((strategy) => {
                      const isLinked = selectedStrategyIds.includes(
                        strategy.id,
                      );
                     

                      return (
                        <Box
                          key={strategy.id}
                          p="5"
                          shadow="md"
                          borderWidth="1px"
                          borderRadius="md"
                          minWidth={{ base: '100%', md: '250px' }} // Ensure boxes have a minimum width
                        >
                          <Flex align="center" justify="space-between">
                            <Text fontWeight="bold">{strategy.name}</Text>
                            <Button
                              colorScheme={isLinked ? 'red' : 'teal'} // Change color for linked strategies
                              size="sm"
                              onClick={() =>
                                handleLinkStrategyToUser(
                                  selectedStrategyId,
                                  strategy.id,
                                  selectedStrategyIds.includes(strategy.id),
                                )
                              }
                            >
                              {isLinked ? 'Unlink' : 'Link'}
                            </Button>
                          </Flex>
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                </FormControl>
              </Box>
            )}
            {transferuserid === user.id && (
              <Box mt="4" bg="gray.50" p="4" borderRadius="md">
                <TransferModal
                  isOpen={isTransferOpen}
                  onClose={onTransferClose}
                  userid={transferuserid}
                  balance={accountinfo}
                />
              </Box>
            )}
          </Box>
        ))}
      </SimpleGrid>

      <Box mt={5} position="relative" textAlign="left">
        <Text as="span" zIndex={1} fontSize="2xl" fontWeight="bold">
          STRATEGIES
        </Text>
        <Divider
          mt={-1} // Move the divider up to align with the text
          borderColor="black.400"
          borderWidth="1px"
        />
      </Box>

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
          <Box
            key={strategy.id}
            p="5"
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
          >
            <Flex
              align="center"
              justify="space-between"
            >
              <Text fontWeight="bold">{strategy.name}</Text>

              <Menu>
                <MenuButton as={IconButton} icon={<MdMoreVert />} />
                <MenuList>
                  <MenuItem
                  as={NavLink}
                  to={`/admin/edit/${strategy.id}/${selectedPairs}`}
                    onClick={() => {
                      setExpandedStrategyId((prev) =>
                        prev === strategy.id ? null : strategy.id,
                      ); // Toggle form visibility
                    }}
                  >
                    {expandedStrategyId === strategy.id
                      ? 'Close Form'
                      : 'Edit Strategy'}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      onDeleteOpen();
                    }}
                  >
                    Delete Strategy
                  </MenuItem>
                </MenuList>
              </Menu>
              <Switch
                isChecked={strategy.active}
                onChange={() => {
                  handleactive(strategy.id, strategy.active);
                }}
                colorScheme="teal"
              />
            </Flex>
            {isDeleteOpen && (
              <StrategyDeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                todelete={strategy.id}
                jwttoken={jwttoken}
              />
            )}
            {/* Collapsible Form */}
            {expandedStrategyId === strategy.id && (
              <EditStrategyForm jwttoken={jwttoken} strategyid={strategy.id} selectedPairs={selectedPairs}/>
            )}
          </Box>
        ))}
      </SimpleGrid>

      {isCreateStrategyOpen && (
        <CreateStrategyModal
          isCreateStrategyOpen={isCreateStrategyOpen}
          onCreateStrategyClose={onCreateStrategyClose}
          jwttoken={jwttoken}
        />
      )}

      <Box mt={5} position="relative" textAlign="left">
        <Text as="span" zIndex={1} fontSize="2xl" fontWeight="bold">
          TRADES
        </Text>
        <Divider
          mt={-1} // Move the divider up to align with the text
          borderColor="black.400"
          borderWidth="1px"
        />
        <TradePositionTable
          positions={positions?.positions}
          onClosePosition={handleClosePosition}
        />

        <Divider
          mt={5} // Move the divider up to align with the text
          mb={5}
          borderColor="black.400"
          borderWidth="1px"
        />
        <TradeHistoryTable tradeHistory={positionshistory.pastTrades} />
      </Box>
    </Box>
  );
}
