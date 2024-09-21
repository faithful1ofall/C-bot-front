// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  RadioGroup,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  Switch,
} from "@chakra-ui/react";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState, useEffect } from "react";
import {
  MdAttachMoney,
  MdAutorenew,
  MdShowChart,
  MdCheckCircle,
  MdCancel,
  MdPerson,
  MdAddAlert,
  MdMoreVert,
  MdSearch,
} from "react-icons/md";
import GeneralExchangeSettingsModal from './components/usersettings';
import TransferModal from './components/Transfer';


export default function UserReports() {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [selectedTradingPairs1, setSelectedTradingPairs1] = useState([]);
  

  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
  const [expandedStrategyId, setExpandedStrategyId] = useState(null);



  const { isOpen: isUserOpen, onOpen: onUserOpen, onClose: onUserClose } = useDisclosure();
  const { isOpen: isTransferOpen, onOpen: onTransferOpen, onClose: onTransferClose } = useDisclosure();
  const { isOpen: isCreateStrategyOpen, onOpen: onCreateStrategyOpen, onClose: onCreateStrategyClose } = useDisclosure();
  const { isOpen: isLinkStrategyOpen, onOpen: onLinkStrategyOpen, onClose: onLinkStrategyClose } = useDisclosure();

  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [hookkey, setHookKey] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [newStrategyName, setNewStrategyName] = useState();
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState([]);
  const [selectedStrategyIds, setSelectedStrategyIds] = useState([]);
  const [transferuserid, setTransferUserId] = useState('');
  const [offset, setOffset] = useState();
  const [marginMode, setmarginMode] = useState();


  // new parameters
  
  const [tradingPairs, setTradingPairs] = useState('');
  const [tradeDirection, setTradeDirection] = useState('Both');
  const [timeFrame, setTimeFrame] = useState('1 Minute');
  const [negativeCandleTrigger, setNegativeCandleTrigger] = useState(0);
  const [isNegativeCandleEnabled, setIsNegativeCandleEnabled] = useState(false);
  const [gridCalls, setGridCalls] = useState(1);
  const [profitLock, setProfitLock] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [takeProfit, setTakeProfit] = useState(0);
  const [orderType, setOrderType] = useState('Limit');
  const [isDelayEnabled, setIsDelayEnabled] = useState(false);
  const [isEdit, SetEdit] = useState(false);  
  const [maxTradableAmount, setMaxTradableAmount] = useState(0);
  const [leverage, setLeverage] = useState(10); // Leverage state
  const [originalStrategy, setOriginalStrategy] = useState(null);
 
  const [callFunds, setCallFunds] = useState(Array(gridCalls || 0).fill(0)); // Funds percentage for each call
  const [callTPs, setCallTPs] = useState(Array(gridCalls || 0).fill(0)); // TP percentage for each call
  const [callNegTriggers, setCallNegTriggers] = useState(Array(gridCalls || 0).fill()); // Negative trigger percentage for each call


  const [accountinfo, setAccountinfo] = useState();

  const tradingViewLink = `${process.env.REACT_APP_BACKENDAPI}/api/tradingview-webhook`;

  const fetchPairs = async () => {
    try {        
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/saved-trading-pairs`); // Adjust the URL based on your backend setup
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();  // Parse the JSON response
      setSelectedTradingPairs1(data.data);
      console.log(data.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  

   // Handle search query change
   const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Save query to history if it's not already there
    if (query && !searchHistory.includes(query)) {
      setSearchHistory([query, ...searchHistory].slice(0, 5)); // Limit history to last 5 queries
    }
  };

  // Handle pair selection
  const handleSelectPairs = (selectedValues) => {
    setSelectedPairs(selectedValues);
  };

  const handleCallFundsChange = (index, value) => {
    const newCallFunds = [...callFunds];
    newCallFunds[index] = value;
    setCallFunds(newCallFunds);
  };



  const handleSyncCallValues = () => {
    setCallFunds(Array(negativeCandleTrigger + 1).fill(callFunds[0]));
    setCallTPs(Array(negativeCandleTrigger + 1).fill(callTPs[0]));
  };


  const handleCallTPChange = (index, value) => {
    const newCallTPs = [...callTPs];
    newCallTPs[index] = value;
    setCallTPs(newCallTPs);
  };


  const handleCallNegTriggerChange = (index, value) => {
    const newCallNegTriggers = [...callNegTriggers];
    newCallNegTriggers[index] = value;
    setCallNegTriggers(newCallNegTriggers);
  };

  const fetchAccountinfo = async (accuserid) => {
    try {        
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/binance/account-info/${accuserid}`); // Adjust the URL based on your backend setup
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();  // Parse the JSON response
      setAccountinfo(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const filteredPairs = selectedTradingPairs1.filter(pair =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("filteredPairs", filteredPairs);

  const fetchUsers = async () => {
    try {        
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users`); // Adjust the URL based on your backend setup
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();  // Parse the JSON response
      setUsers(data);
      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteuser = async (id) => {

    console.log("user id", id);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        fetchUsers();
      } else {
        console.error('Failed to delete User');
      }
    } catch (error) {
      console.error('Error deleting User:', error);
    }
  };

  const fetchStrategies = async () => {
    try {        
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategies`); // Adjust the URL based on your backend setup
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();  // Parse the JSON response
      setStrategies(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteStrategy = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategies/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        fetchStrategies();
        fetchUsers();
      } else {
        console.error('Failed to delete strategy');
      }
    } catch (error) {
      console.error('Error deleting strategy:', error);
    }
  };
  
   useEffect(() => {
    fetchUsers();
    fetchStrategies();
    fetchPairs();
  }, []);

 const tradinghook = async() => {
    const hooking = { 
      strategy: "test",
    };
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/tradingview-webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:  JSON.stringify(hooking),
        });

        const data = await response.json();

        console.log("hooking", data);
      }  catch (error) {
        console.error('Request failed', error);
      }

  }

  const handleSubmit = async() => {
    const newStrategy = {
      name: newStrategyName,
      hookkey: hookkey,
      tradingPair: tradingPairs,
      tradeDirection,
      timeFrame,
      negativeCandleTrigger: isNegativeCandleEnabled ? negativeCandleTrigger : null,
      gridCalls,
      
      calls: callFunds.map((funds, index) => ({
        funds,
        tp: callTPs[index],
        negTrigger: callNegTriggers[index],
      })),
      profitLock,
      stopLoss,
      takeProfit,
      orderType,
      isDelayEnabled,
      maxTradableAmount,
      leverage,
      offset,
      marginMode,
    };

    if (!isEdit || isEdit === 0){
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:  JSON.stringify(newStrategy),
        });
    
        if (response.ok) {
          console.log('Strategy added successfully');
        } else {
          console.error('Error adding strategy');
        }
      } catch (error) {
        console.error('Request failed', error);
      }

      setStrategies((prevStrategies) => [...prevStrategies, newStrategy]);

      console.log("newStrategy", newStrategy);

      onCreateStrategyClose();

    } else {


      console.log("isEdit", isEdit);

      // Create an object with only the changed fields
      const updatedFields = {};

      Object.keys(newStrategy).forEach((key) => {
        if (newStrategy[key] !== originalStrategy[key]) {
          updatedFields[key] = newStrategy[key];
        }
      });
      
      try {
        
        await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategy/${isEdit}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body:  JSON.stringify(updatedFields),
        });

      } catch (error) {
        console.error('Request failed', error);
      }

      console.log("newStrategy Update", newStrategy);

      fetchUsers();
      fetchStrategies();

      onCreateStrategyClose();
      
      SetEdit(null);

    }
  };

  const handleCreate = () => {
    // Clear all the form values by resetting them to their initial/default state
    setOriginalStrategy(null); // No original strategy for creation
    setNewStrategyName(''); // Clear strategy name
    setHookKey('');
  };

  const handleactive = async (strategyIdd, currentstatus) => {

    const activate = {
      active: !currentstatus,
    };
    
    try {
      
      await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategy/${strategyIdd}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body:  JSON.stringify(activate),
      });

    } catch (error) {
      console.error('Request failed', error);
    }

    
    await fetchStrategies();
    console.log("activate Update", activate);
  }
  


  const handleEdit = async(editid) => {
    try {
      
      const response1 = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategy/${editid}`);

      if (!response1.ok) {
        throw new Error(`HTTP error! status: ${response1.status}`);
      }
      const data1 = await response1.json(); 

      setOriginalStrategy(data1);

      setNewStrategyName(data1.name);
      setTradingPairs(data1.tradingPair);
      setTradeDirection(data1.tradeDirection);
      setTimeFrame(data1.timeFrame);
      setNegativeCandleTrigger(data1.negativeCandleTrigger || null);
      setGridCalls(data1.gridCalls);
      setHookKey(data1.hookkey);

      setCallFunds(data1.calls.map(call => call.funds));
      setCallTPs(data1.calls.map(call => call.tp));
      setCallNegTriggers(data1.calls.map(call => call.negTrigger));

      setProfitLock(data1.profitLock);
      setStopLoss(data1.stopLoss);
      setTakeProfit(data1.takeProfit);
      setOrderType(data1.orderType);
      setIsDelayEnabled(data1.isDelayEnabled);
      setMaxTradableAmount(data1.maxTradableAmount);
      setLeverage(data1.leverage);
      setOffset(data1.offset);
      setmarginMode(data1.marginMode);

    }  catch (error) {
      console.error('Request failed', error);
    }

  }


  const handleAddUser = async() => {
    if (apiKey && apiSecret && name) {
      const newUser = {
        name,
        apiKey,
        apiSecret,
        strategyIds: [],
      };

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setUsers([...users, data.user]); // Add the new user to the list
          setApiKey("");
          setApiSecret("");
          onUserClose(); // Close modal or form
          console.log('User added successfully:', data);
        } else {
          console.error('Error adding user:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleLinkStrategyToUser = async(userId, strategyid, boole) => {

    if (boole) {
      try {
        await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users/${userId}/strategies/${strategyid}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error:', error);
      }
      fetchUsers();

        const updatedStrategyIds = selectedStrategyIds.filter(id => id !== strategyid);
  
        // Set the new array as the state
        setSelectedStrategyIds(updatedStrategyIds);

    } else {

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users/${userId}/strategies/${strategyid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        console.log("linking", data);

        if (response.ok) {
          fetchUsers();

          const updatedStrategyIds = [...selectedStrategyIds, strategyid];
    
          // Set the new array as the state
          setSelectedStrategyIds(updatedStrategyIds);
         } else {
          console.error('Error adding user:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 2, lg: 2 }}
        gap="20px"
        mb="20px">
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdPerson} color="white" />}
            />
          }
          name="No of Users"
          value="500"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />}
            />
          }
          name="No of Trades"
          value="2500"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdAutorenew} color={brandColor} />}
            />
          }
          name="No of Active Trades"
          value="120"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdShowChart} color={brandColor} />}
            />
          }
          name="No of Strategies"
          value="35"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdCheckCircle} color={brandColor} />}
            />
          }
          name="No of Successful Trades"
          value="2300"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdCancel} color={brandColor} />}
            />
          }
          name="No of Failed Trades"
          value="200"
        />
      </SimpleGrid>

       {/* Dropdown Button */}
       <Menu>
        <MenuButton as={Button} leftIcon={<Icon as={MdPerson} />} colorScheme="teal">
          Add Trading Pairs
        </MenuButton>

        <MenuList p={4} width="300px">
          {/* Search Bar */}
          <Input
            placeholder="Search trading pairs"
            value={searchQuery}
            onChange={handleSearch}
            mb={4}
            leftIcon={<Icon as={MdSearch} />}
          />

          {/* Search History */}
          {searchHistory.length > 0 && (
            <Box mb={4}>
              <strong>Recent Searches:</strong>
              <Stack>
                {searchHistory.map((query, index) => (
                  <Button
                    key={index}
                    variant="link"
                    onClick={() => setSearchQuery(query)}
                  >
                    {query}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}

          {/* Checkbox List for Trading Pairs */}
          <CheckboxGroup value={selectedPairs} onChange={handleSelectPairs}>
            <Stack spacing={3}>
              {filteredPairs.map((pair) => (
                <Checkbox key={pair_id} value={pair.symbol}>
                  {pair.symbol}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </MenuList>
      </Menu>

      <Flex justify="space-between" mt="40px">
        <Button
          leftIcon={<Icon as={MdPerson} />}
          colorScheme="teal"
          onClick={onUserOpen}
        >
          Add User
        </Button>
        <Button
          leftIcon={<Icon as={MdPerson} />}
          colorScheme="teal"
          onClick={tradinghook}
        >
          Test Webhook
        </Button>
      </Flex>

      <GeneralExchangeSettingsModal
        isOpen={isGeneralSettingsOpen}
        onClose={() => {setIsGeneralSettingsOpen(false); setTransferUserId("");}}
        userid={transferuserid}
        balance={accountinfo}
      />

     {/* Add User Modal */}
     <Modal isOpen={isUserOpen} onClose={onUserClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>User Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>API Key</FormLabel>
              <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>API Secret</FormLabel>
              <Input value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleAddUser}>
              Add User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }} gap='20px' mt="40px">
        {users.map((user, index) => (
          <Box key={`${index}-${index}`} p="5" shadow="md" borderWidth="1px" borderRadius="md">
            <Flex align="center" justify="space-between">
              <Avatar src="https://bit.ly/dan-abramov" />
              <Menu>
                <MenuButton as={IconButton} icon={<MdMoreVert />} />
                <MenuList>
                  <MenuItem onClick={() => { setSelectedStrategyId(user.id); setSelectedStrategyIds(user.strategyIds.map(id => strategies.find(s => s.id === id)?.id)); onLinkStrategyOpen(); }}>Link Strategies</MenuItem>
                  <MenuItem onClick={() => { fetchAccountinfo(user.id); setTransferUserId(user.id); setIsGeneralSettingsOpen(true);}}>User/Exchange Settings</MenuItem>
                  <MenuItem onClick={() => { fetchAccountinfo(user.id); setTransferUserId(user.id); onTransferOpen(); }}>Transfer Funds</MenuItem>
                  <MenuItem onClick={() => deleteuser(user.id) }>Delete User</MenuItem>
                  
                </MenuList>
              </Menu>
            </Flex>
            <Box mt="4">
              <Text>User Name: {user?.name}</Text>
              <Text>Strategies: {user.strategyIds.map(id => strategies.find(s => s.id === id)?.name || 'None').join(', ')}</Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>


      <TransferModal isOpen={isTransferOpen} onClose={onTransferClose} balance={accountinfo} userid={transferuserid} fetchAccountinfo={fetchAccountinfo}/>

      <Button
          mt="40px"
          leftIcon={<Icon as={MdAddAlert} />}
          colorScheme="blue"
          onClick={() => {SetEdit(""); handleCreate(); onCreateStrategyOpen();}}
        >
          Create Strategy
        </Button>

      <SimpleGrid mt="20px" columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }} gap='20px'>
        {strategies.map((strategy) => (
          <Box key={strategy.id} p="5" shadow="md" borderWidth="1px" borderRadius="md">
            <Flex align="center" justify="space-between"  onClick={() => {
              SetEdit(strategy.id);
              handleEdit(strategy.id); // Assuming you use this to set form data
              setExpandedStrategyId((prev) => (prev === strategy.id ? null : strategy.id)); // Toggle form visibility
            }}>
              <Text fontWeight="bold">{strategy.name}</Text>
             
              <Menu>
                <MenuButton as={IconButton} icon={<MdMoreVert />} />
                <MenuList>
                <MenuItem
                    onClick={() => {
                      SetEdit(strategy.id);
                      handleEdit(strategy.id); // Assuming you use this to set form data
                      setExpandedStrategyId((prev) => (prev === strategy.id ? null : strategy.id)); // Toggle form visibility
                    }}
                  >
                    {expandedStrategyId === strategy.id ? 'Close Form' : 'Edit Strategy'}
                  </MenuItem>
                  <MenuItem onClick={() => deleteStrategy(strategy.id) }>Delete Strategy</MenuItem>
                </MenuList>
              </Menu>
              <Switch
                isChecked={strategy.active}
                onChange={() => { handleactive(strategy.id, strategy.active);}}
                colorScheme="teal"
              />
            </Flex>
             {/* Collapsible Form */}
              {expandedStrategyId === strategy.id && (
                <Box mt="4" bg="gray.50" p="4" borderRadius="md">
                  {/* Form Content Goes Here */}
                  <FormControl mb="4">
                    <FormLabel>Strategy Name</FormLabel>
                    <Input value={newStrategyName} onChange={(e) => setNewStrategyName(e.target.value)} />
                  </FormControl>

                  <FormControl mb="4">
                    <FormLabel>Hook Key</FormLabel>
                    <Input value={hookkey} onChange={(e) => setHookKey(e.target.value)} />
                  </FormControl>


                  <FormControl mb="4">
                    <FormLabel>TradingView Link</FormLabel>
                    <Input value={tradingViewLink} isReadOnly />
                  </FormControl>

                  <FormControl mb="4">
                      <FormLabel>Leverage</FormLabel>
                      <NumberInput min={1} max={100} value={leverage || ""} onChange={(valueString) => setLeverage(isNaN(valueString) ? 0 : valueString)}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    <FormControl mt="4">
                      <FormLabel>Cross/Isolated Mode</FormLabel>
                      <RadioGroup onChange={(value) => setmarginMode(value)} value={marginMode}>
                        <Stack direction="row">
                          <Radio value="cross">Cross</Radio>
                          <Radio value="isolated">Isolated</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>

                  <FormControl mb="4">
                    <FormLabel>Trading Pair</FormLabel>
                    <Select
                      value={tradingPairs || ''}
                      onChange={(e) => setTradingPairs(e.target.value)}
                    >
                      {selectedPairs.map((pair) => (
                        <option key={pair} value={pair}>
                          {pair}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl mb="4">
                    <FormLabel>Trade Direction</FormLabel>
                    <Select value={tradeDirection} onChange={(e) => setTradeDirection(e.target.value)}>
                      <option value="Buy">Long/Buy</option>
                      <option value="Sell">Short/Sell</option>
                      <option value="Sell">Both</option>
                    </Select>
                  </FormControl>

                  <FormControl mb="4">
                    <FormLabel>Time Frame</FormLabel>
                    <Select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
                    <option value="15s">15 Seconds</option>
                      <option value="30s">30 Seconds</option>
                      <option value="45s">45 Seconds</option>
                      <option value="1m">1 Minute</option>
                      <option value="2m">2 Minute</option>
                      <option value="3m">3 Minute</option>
                      <option value="5m">5 Minute</option>
                      <option value="15m">15 Minute</option>
                      <option value="30m">30 Minute</option>
                      <option value="1h">1 Hour</option>
                      <option value="2h">2 Hour</option>
                      <option value="4h">4 Hour</option>
                      <option value="6h">6 Hour</option>
                      <option value="8h">8 Hour</option>
                      <option value="12h">12 Hour</option>
                      <option value="24h">24 Hour</option>
                      <option value="48h">48 Hour</option>
                      <option value="72h">72 Hour</option>
                    </Select>
                  </FormControl>

                  <FormControl mb="4">
                    <Flex alignItems="center">
                      <FormLabel>Negative Value Trigger (%)</FormLabel>
                      <Checkbox isChecked={isNegativeCandleEnabled} onChange={(e) => setIsNegativeCandleEnabled(e.target.checked)}>Enable</Checkbox>
                    </Flex>
                    {isNegativeCandleEnabled && (
                      <NumberInput value={negativeCandleTrigger || ""} onChange={(valueString) => setNegativeCandleTrigger(parseInt(valueString))}>
                        <NumberInputField />
                      </NumberInput>
                    )}
                  </FormControl>

                  <FormControl mb="4">
                    <FormLabel>Initial Call</FormLabel>
                  </FormControl>

                  <Box mt="4" p="4" bg="gray.100" borderRadius="md">
                    <Text fontSize="lg" fontWeight="bold">Call 1</Text>

                    <FormControl mb="4">
                      <FormLabel>Call 1 Funds %</FormLabel>
                      <NumberInput min={0} max={100} value={callFunds[0] || ""} onChange={(valueString) => handleCallFundsChange(0, isNaN(valueString) ? 0 : valueString)}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    <FormControl mb="4">
                      <FormLabel>Call 1 TP%</FormLabel>
                      <NumberInput min={0} max={100} value={callTPs[0] || ""} onChange={(valueString) => handleCallTPChange(0, isNaN(valueString) ? 0 : valueString)}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    {/* Sync Call 1 Values */}
                    <Button mt="2" colorScheme="blue" onClick={handleSyncCallValues}>
                      Sync Call 1 Values to All
                    </Button>
                  </Box>   

                  {/* Loop through each call and display grouped inputs */}
                  {isNegativeCandleEnabled && (
                    Array.from({ length: negativeCandleTrigger }, (_, index) => (
                    <Box key={index} mt="4" p="4" bg="gray.100" borderRadius="md">                 
                      <Text fontSize="lg" fontWeight="bold">Call {index + 2}</Text>   
                          <Box  mb="4" key={index}>
                            <FormControl mb="4">
                              <FormLabel>Call {index + 2} Funds %</FormLabel>
                              <NumberInput  min={0} max={100} value={callFunds[index + 1] || ""} onChange={(valueString) => handleCallFundsChange(index + 1, isNaN(valueString) ? 0 : valueString)}>
                                <NumberInputField />
                              </NumberInput>
                            </FormControl>

                            <FormControl mb="4">
                              <FormLabel>Call {index + 2} TP%</FormLabel>
                              <NumberInput min={0} max={100} value={callTPs[index + 1] || ""} onChange={(valueString) => handleCallTPChange(index + 1, isNaN(valueString) ? 0 : valueString)}>
                                <NumberInputField />
                              </NumberInput>
                            </FormControl>

                            <FormControl mb="4">
                              <FormLabel>Call {index + 2} Negative Trigger %</FormLabel>
                              <NumberInput value={callNegTriggers[index + 1] || ""} onChange={(valueString) => handleCallNegTriggerChange(index + 1, isNaN(valueString) ? 0 : valueString)}>
                                <NumberInputField />
                              </NumberInput>
                            </FormControl>
                          </Box>                 
                    </Box>
                  )))}
                    <FormControl mb="4">
                      <FormLabel>Profit Lock %</FormLabel>
                      <NumberInput value={profitLock || ""} onChange={(valueString) => setProfitLock(isNaN(valueString) ? 0 : valueString)}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    <FormControl mb="4">
                      <FormLabel>Stop Loss % (SL%)</FormLabel>
                      <NumberInput value={stopLoss || ""} onChange={(valueString) => setStopLoss(isNaN(valueString) ? 0 : valueString)}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    <FormControl mb="4">
                      <FormLabel>Order Type (for SL/TP)</FormLabel>
                      <Select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                        <option value="Limit">Limit Order</option>
                        <option value="Market">Market Order</option>
                      </Select>
                    </FormControl>

                    <FormControl mb="4">
                      <Flex alignItems="center">
                        <FormLabel>Delayed SL and TP</FormLabel>
                        <Checkbox isChecked={isDelayEnabled} onChange={(e) => setIsDelayEnabled(e.target.checked)}>Enable</Checkbox>
                      </Flex>
                      {isDelayEnabled && (
                        <Box mt="2" mb="4" p="4" bg="gray.100" borderRadius="md">
                          <p>If enabled, the bot will wait until the price is near the SL/TP before placing a limit order. If the limit order fails, a market order will be executed instead.</p>
                          <FormLabel>Offset %</FormLabel>
                            <NumberInput value={offset || ""} onChange={(valueString) => setOffset(isNaN(valueString) ? 0 : valueString)}>
                              <NumberInputField />
                            </NumberInput>
                        </Box>
                      )}
                    </FormControl>

                    <FormControl mb="4">
                      <FormLabel>Max Tradable Amount</FormLabel>
                      <NumberInput value={maxTradableAmount || ""} onChange={(valueString) => setMaxTradableAmount(isNaN(valueString) ? 0 : valueString)}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    
                  <Button mt="4" colorScheme="teal" onClick={handleSubmit}>
                    {isEdit ? 'Update Strategy' : 'Create Strategy'}
                  </Button>
                </Box>
              )}
          </Box>
        ))}
      </SimpleGrid>

       {/* Link Strategy Modal */}
       <Modal isOpen={isLinkStrategyOpen} onClose={onLinkStrategyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Link Strategies to User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Select Strategies to Link</FormLabel>
              <SimpleGrid mt="20px" columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }} gap='20px'>
                {strategies.map((strategy) => (
                  <Box key={`${strategy.id}-${strategy.id}`} p="5" shadow="md" borderWidth="1px" borderRadius="md">
                    <Flex align="center" justify="space-between">
                      <Text fontWeight="bold">{strategy.name}</Text>
                      <Button colorScheme="teal" onClick={() => handleLinkStrategyToUser(selectedStrategyId, strategy.id, selectedStrategyIds.includes(strategy.id))}>
                        {selectedStrategyIds.includes(strategy.id) ? 'Unlink' : 'Link'}
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>

       {/* Create Strategy Modal */}
       <Modal isOpen={isCreateStrategyOpen} onClose={onCreateStrategyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? 'Update Strategy' : 'Create Strategy'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

          <FormControl>
              <FormLabel>Strategy Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Webhook Key</FormLabel>
              <Input value={hookkey} onChange={(e) => setHookKey(e.target.value)} />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>TradingView Link</FormLabel>
              <Input value={tradingViewLink} isReadOnly />
            </FormControl>

            
            </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSubmit}>   
              {isEdit ? 'Update Strategy' : 'Create Strategy'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
