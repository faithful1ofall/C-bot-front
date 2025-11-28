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
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAttachMoney,
  MdAutorenew,
  MdShowChart,
  MdCheckCircle,
  MdPerson,
  MdMoreVert,
  MdMonetizationOn,
} from 'react-icons/md';
import GeneralExchangeSettingsModal from './components/usersettings';
import TransferModal from './components/Transfer';
import TradePositionTable from './components/PositionsTable';
import TradeHistoryTable from './components/Tradehistory';
import LoggerDropdown from './components/loggerdrop';
import TradingHookTriggerModal from './components/tradehook';
import UserDeleteConfirmationModal from './components/userdelete';
import UserModal from './components/adduser';
import TradingPairs from './components/tradingpair';
import StrategiesList from './components/strategylist';
import apiService from 'services/api';
import { useAuth } from 'hooks/useApi';

export default function UserReports() {
  const toast = useToast();
  const navigate = useNavigate();
  const { checkTokenExpiry, logout } = useAuth();

  const strategies = JSON.parse(localStorage.getItem('botstrategies'));
  const activestrategies = localStorage.getItem('activestrategies');

  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
  const [isLinkStrategyOpen, setLinkStrategyOpen] = useState(false);

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
  const [selectedStrategyId, setSelectedStrategyId] = useState([]);
  const [selectedStrategyIds, setSelectedStrategyIds] = useState([]);
  const [transferuserid, setTransferUserId] = useState('');

  // new parameters

  const [useredit, SetUserEdit] = useState(false);

 // const tradingViewLink = `${process.env.REACT_APP_BACKENDAPI}/api/tradingview-webhook`;
 const positions = localStorage.getItem("botpositions");
  const [positionshistory, setPositionsHistory] = useState([]); // Your trade positions data



  const fetchPositionhistory = useCallback(async () => {
    try {
      const data = await apiService.getBinancePastTrades();
      setPositionsHistory(data);
    } catch (err) {
      console.error('Error fetching position history:', err);
      toast({
        title: 'Error loading positions',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  const handleClosePosition = useCallback(async (position) => {
    try {
      await apiService.closePosition(position.userId, position.symbol);
      
      toast({
        title: 'Trade closed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      fetchPositionhistory();
    } catch (err) {
      toast({
        title: 'Error closing trade',
        description: err.message || 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast, fetchPositionhistory]);

  const fetchtradeinfo = useCallback(async (usid) => {
    try {
      const { data } = await apiService.validateBinanceCredentials(usid);
      
      const permissions = {
        Reading: data.enableReading,
        Futures: data.enableFutures,
        UniversalTransfer: data.permitsUniversalTransfer,
      };

      const enabledPermissions = Object.entries(permissions)
        .filter(([_, value]) => value)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase());

      if (enabledPermissions.length > 0) {
        const formattedPermissions =
          enabledPermissions.length > 2
            ? `${enabledPermissions.slice(0, -1).join(', ')} and ${enabledPermissions.slice(-1)}`
            : enabledPermissions.join(' and ');

        toast({
          title: 'API Successfully Validated',
          description: `${formattedPermissions} enabled.`,
          status: 'success',
          duration: 7000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'There was an issue fetching validation info.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  const fetchapiinfo = useCallback(async (usid) => {
    try {
      const { exchangeInfo } = await apiService.getBinanceExchangeInfo(usid);

      const permissions = {
        limit: exchangeInfo[0].exchangeInfo[0].limit,
        usedlimit: exchangeInfo[0].headersInfo.usedIPWeight1M,
      };

      toast({
        title: 'IP Limit Used and Total Per minute(1 minute)',
        description: `${permissions.usedlimit}/${permissions.limit} per-minute. userid ${usid}`,
        status: 'success',
        duration: 7000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error fetching API info',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast({
        title: 'Error loading users',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  const deleteuser = useCallback(async (id) => {
    try {
      await apiService.deleteUser(id);
      
      toast({
        title: 'User deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      fetchUsers();
      onDeleteClose1();
    } catch (error) {
      toast({
        title: 'Error deleting user',
        description: error.message || 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast, fetchUsers, onDeleteClose1]);

  
  useEffect(() => {
    if (!checkTokenExpiry()) {
      logout();
    }
  }, [checkTokenExpiry, logout]);

  useEffect(() => {
    fetchUsers();
    fetchPositionhistory();
  }, [
    fetchPositionhistory,
    fetchUsers
  ]);

  const handleuseractive = useCallback(async (userIdd, currentstatus) => {
    try {
      await apiService.updateUser(userIdd, {
        active: !currentstatus,
      });

      toast({
        title: !currentstatus ? 'User activated successfully' : 'User deactivated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      await fetchUsers();
    } catch (error) {
      toast({
        title: 'Error updating user',
        description: error.message || 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [fetchUsers, toast]);

  

  
  const handleLinkStrategyToUser = useCallback(async (userId, strategyid, boole) => {
    try {
      if (boole) {
        await apiService.unlinkStrategyFromUser(userId, strategyid);
        
        toast({
          title: 'Strategy unlinked from user successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setSelectedStrategyIds((prev) => prev.filter((id) => id !== strategyid));
      } else {
        await apiService.linkStrategyToUser(userId, strategyid);
        
        toast({
          title: 'Strategy linked to user successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setSelectedStrategyIds((prev) => [...prev, strategyid]);
      }

      fetchUsers();
    } catch (error) {
      toast({
        title: boole ? 'Error unlinking strategy' : 'Error linking strategy',
        description: error.message || 'Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [fetchUsers, toast]);
  

  // Function to handle navigation and setting local storage
  const handleClosehook = async() => {
 //   await fetchPosition();
    onTradingHookTriggerClose();
  };

  const MemoizedSwitch = React.memo(({ isChecked, onChange }) => (
  <Switch isChecked={isChecked} onChange={onChange} colorScheme="teal" />
));

const MemoizedMenuItem = React.memo(({ onClick, children }) => (
  <MenuItem onClick={onClick}>
    {children}
  </MenuItem>
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
          value={users.filter((user) => user.active).length || 0}
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
          value={positions ? positions : 0}
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
          value={strategies?.length || 0}
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
          value={activestrategies || 0}
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
                  <MemoizedMenuItem onClick={() => fetchtradeinfo(user.id)}>
                    Validate API connection
                  </MemoizedMenuItem>
                  <MemoizedMenuItem onClick={() => fetchapiinfo(user.id)}>
                    {' '}
                    API IP Limit{' '}
                  </MemoizedMenuItem>
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
  onChange={() => handleuseractive(user.id, user.active)}
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
                />
              </Box>
            )}
          </Box>
        ))}
      </SimpleGrid>

      <StrategiesList />

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
