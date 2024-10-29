// Chakra import
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
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
} from 'react-icons/md';
import GeneralExchangeSettingsModal from './components/usersettings';
import TransferModal from './components/Transfer';
import TradePositionTable from './components/PositionsTable';
import TradeHistoryTable from './components/Tradehistory';
import LoggerDropdown from './components/loggerdrop';
import TradingHookTriggerModal from './components/tradehook';
import StrategyDeleteConfirmationModal from './components/strategydelete';
import UserDeleteConfirmationModal from './components/userdelete';
import UserModal from './components/adduser';
import TradingPairs from './components/tradingpair';

export default function UserReports() {
  const toast = useToast();
  const navigate = useNavigate();

  const jwttoken = localStorage.getItem('jwtToken');

  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
  const [isLinkStrategyOpen, setLinkStrategyOpen] = useState(false);


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
    fetchPositionhistory();
  }, [
    fetchPositionhistory,
    fetchUsers,
    fetchStrategies
  ]);

  const handleuseractive = useCallback(async (userIdd, currentstatus) => {
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
  }, [jwttoken, fetchUsers]);

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
  

  // Function to handle navigation and setting local storage
  const handleEditStrategy = (strategyId) => {
    // Set local storage items
    localStorage.setItem("strategyid", strategyId);    
    // Navigate to the edit route
    navigate(`/admin/edit`);
  };
  // Function to handle navigation and setting local storage
  const handleClosehook = async() => {
 //   await fetchPosition();
    onTradingHookTriggerClose();
  };

  const MemoizedSwitch = React.memo(({ isChecked, onChange }) => (
  <Switch isChecked={isChecked} onChange={onChange} colorScheme="teal" />
));


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


      <TradingPairs />

      

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
        onClose={handleClosehook}
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
          fetchusers={fetchUsers}
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
            <MemoizedSwitch
  isChecked={user?.active}
  onChange={() => handleuseractive(user.id, !user.active)}
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
                          minWidth={{ base: '100%', md: '250px' }}
                        >
                          <Flex align="center" justify="space-between">
                            <Text fontWeight="bold">{strategy.name}</Text>
                            <Button
                              colorScheme={isLinked ? 'red' : 'teal'}
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
          mt={-1}
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
                    onClick={() => {
                      handleEditStrategy(strategy.id)
                      }}
                  >
                   Edit Strategy
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
          </Box>
        ))}
      </SimpleGrid>

      <Box mt={5} position="relative" textAlign="left">
        <Text as="span" zIndex={1} fontSize="2xl" fontWeight="bold">
          TRADES
        </Text>
        <Divider
          mt={-1}
          borderColor="black.400"
          borderWidth="1px"
        />
        <TradePositionTable
          onClosePosition={handleClosePosition}
        />

        <Divider
          mt={5}
          mb={5}
          borderColor="black.400"
          borderWidth="1px"
        />
        <TradeHistoryTable tradeHistory={positionshistory.pastTrades} />
      </Box>
      <Divider
        mt={5}
        mb={5}
        borderColor="black.400"
        borderWidth="1px"
      />
      <LoggerDropdown />
    </Box>
  );
}
