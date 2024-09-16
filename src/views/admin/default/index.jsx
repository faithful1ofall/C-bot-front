// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Checkbox,
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
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState, useEffect } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
  MdPerson,
  MdAddAlert,
  MdMoreVert,
} from "react-icons/md";


export default function UserReports() {

  const { isOpen: isUserOpen, onOpen: onUserOpen, onClose: onUserClose } = useDisclosure();
  const { isOpen: isCreateStrategyOpen, onOpen: onCreateStrategyOpen, onClose: onCreateStrategyClose } = useDisclosure();
  const { isOpen: isLinkStrategyOpen, onOpen: onLinkStrategyOpen, onClose: onLinkStrategyClose } = useDisclosure();

  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [users, setUsers] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [newStrategyName, setNewStrategyName] = useState();
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState([]);
  const [selectedStrategyIds, setSelectedStrategyIds] = useState([]);


  // new parameters
  const [tradingViewLink, setTradingViewLink] = useState('');
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
  const [maxTradableAmount, setMaxTradableAmount] = useState(0);
  const [leverage, setLeverage] = useState(10); // Leverage state

  // State for Call 1
  const [call1Funds, setCall1Funds] = useState(0);
  const [call1TP, setCall1TP] = useState(0);
 
  const [callFunds, setCallFunds] = useState(Array(gridCalls || 0).fill(0)); // Funds percentage for each call
  const [callTPs, setCallTPs] = useState(Array(gridCalls || 0).fill(0)); // TP percentage for each call
  const [callNegTriggers, setCallNegTriggers] = useState(Array(gridCalls || 0).fill()); // Negative trigger percentage for each call


  const checkBalance = strategies?.checkBalance || false; // Default value from strategy
  const hedgeMode = strategies?.hedgeMode || false; // Default value from strategy
  const [idCounter, setIdCounter] = useState(strategies.length > 0 ? Math.max(...strategies.map(s => s.id)) + 1 : 1); // Initialize ID counter


  const handleCallFundsChange = (index, value) => {
    const newCallFunds = [...callFunds];
    newCallFunds[index] = value;
    setCallFunds(newCallFunds);
  };


  const handleCall1FundsChange = (value) => {
    setCall1Funds(value);
  };

  const handleSyncCallValues = () => {
    setCallFunds(Array(gridCalls).fill(call1Funds));
    setCallTPs(Array(gridCalls).fill(call1TP));
  };


  const handleCallTPChange = (index, value) => {
    const newCallTPs = [...callTPs];
    newCallTPs[index] = value;
    setCallTPs(newCallTPs);
  };

  const handleCall1TPChange = (value) => {
    setCall1TP(value);
  };

  const handleCallNegTriggerChange = (index, value) => {
    const newCallNegTriggers = [...callNegTriggers];
    newCallNegTriggers[index] = value;
    setCallNegTriggers(newCallNegTriggers);
  };

  const deleteStrategy = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategies/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Strategy deleted successfully');
      } else {
        console.error('Failed to delete strategy');
      }
    } catch (error) {
      console.error('Error deleting strategy:', error);
    }
  };
  

   // useEffect to fetch strategies on component mount
   useEffect(() => {
    const fetchStrategies = async () => {
      try {        
        const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategies`); // Adjust the URL based on your backend setup
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();  // Parse the JSON response
        setStrategies(data);
        console.log("responce data", data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchStrategies();
  }, []);

  const handleSubmit = async() => {
    const newStrategy = {
      id: idCounter,
      name: newStrategyName,
      tradingPairs,
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
    };

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

    // Update the ID counter
    setIdCounter(idCounter + 1);

    console.log("newStrategy", newStrategy);

    onCreateStrategyClose();
    // Send newStrategy to backend or save it in state
  };


  const handleAddUser = () => {
    if (apiKey && apiSecret) {
      const newUser = {
        apiKey,
        apiSecret,
        strategyIds: [],
      };
      setUsers([...users, newUser]);
      setApiKey("");
      setApiSecret("");
      onUserClose();
    }
  };

  const handleShowStrategies = (userIndex) => {
    const userStrategies = users[userIndex].strategyIds.map(
      (strategyId) => strategies.find((strategy) => strategy.id === strategyId)
    );
    console.log(`Showing strategies for user ${userIndex}`, userStrategies);
  };

  const handleLinkStrategyToUser = () => {
    if (selectedStrategyId !== null) {
      const updatedUsers = users.map(user => ({
        ...user,
        strategyIds: user.strategyIds.includes(selectedStrategyId)
          ? user.strategyIds
          : [...user.strategyIds, selectedStrategyId],
      }));
      setUsers(updatedUsers);
      setSelectedStrategyId(null);
      onLinkStrategyClose();
    }
  };

  const handleUnlinkStrategyFromUser = () => {
    if (selectedStrategyId !== null) {
      const updatedUsers = users.map(user => ({
        ...user,
        strategyIds: user.strategyIds.filter(id => id !== selectedStrategyId),
      }));
      setUsers(updatedUsers);
      setSelectedStrategyId(null);
      onLinkStrategyClose();
    }
  };

  const handleStrategySelection = (strategyId) => {
    setSelectedStrategyIds(prev => 
      prev.includes(strategyId)
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Earnings'
          value='$350.4'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Spend this month'
          value='$642.39'
        />
        <MiniStatistics growth='+23%' name='Sales' value='$574.34' />
        <MiniStatistics
          endContent={
            <Flex me='-16px' mt='10px'>
              <FormLabel htmlFor='balance'>
                <Avatar src={Usa} />
              </FormLabel>
              <Select
                id='balance'
                variant='mini'
                mt='5px'
                me='0px'
                defaultValue='usd'>
                <option value='usd'>USD</option>
                <option value='eur'>EUR</option>
                <option value='gba'>GBA</option>
              </Select>
            </Flex>
          }
          name='Your balance'
          value='$1,000'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />}
            />
          }
          name='New Tasks'
          value='154'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Total Projects'
          value='2935'
        />
      </SimpleGrid>

      <Flex justify="space-between" mt="40px">
        <Button
          leftIcon={<Icon as={MdPerson} />}
          colorScheme="teal"
          onClick={onUserOpen}
        >
          Add User
        </Button>
      </Flex>

     {/* Add User Modal */}
     <Modal isOpen={isUserOpen} onClose={onUserClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
          <Box key={index} p="5" shadow="md" borderWidth="1px" borderRadius="md">
            <Flex align="center" justify="space-between">
              <Avatar src="https://bit.ly/dan-abramov" />
              <Menu>
                <MenuButton as={IconButton} icon={<MdMoreVert />} />
                <MenuList>
                  <MenuItem onClick={() => handleShowStrategies(index)}>Show Strategies</MenuItem>
                  <MenuItem onClick={() => { setSelectedStrategyId(index); onLinkStrategyOpen(); }}>Link Strategies</MenuItem>
                  <MenuItem onClick={() => onUserOpen() }>Delete User</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <Box mt="4">
              <Text>API Key: {user.apiKey}</Text>
              <Text>API Secret: {user.apiSecret}</Text>
              <Text>Strategies: {user.strategyIds.map(id => strategies.find(s => s.id === id)?.name || 'None').join(', ')}</Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      <Button
          mt="40px"
          leftIcon={<Icon as={MdAddAlert} />}
          colorScheme="blue"
          onClick={onCreateStrategyOpen}
        >
          Create Strategy
        </Button>

      <SimpleGrid mt="20px" columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }} gap='20px'>
        {strategies.map((strategy) => (
          <Box key={strategy.id} p="5" shadow="md" borderWidth="1px" borderRadius="md">
            <Flex align="center" justify="space-between">
              <Text fontWeight="bold">{strategy.name}</Text>
              <Menu>
                <MenuButton as={IconButton} icon={<MdMoreVert />} />
                <MenuList>
                  <MenuItem onClick={() => handleStrategySelection(strategy.id)}>Edit Strategy</MenuItem>
                  <MenuItem onClick={() => handleStrategySelection(strategy.id)}>Link to Users</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
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
                  <Box key={strategy.id} p="5" shadow="md" borderWidth="1px" borderRadius="md">
                    <Flex align="center" justify="space-between">
                      <Text fontWeight="bold">{strategy.name}</Text>
                      <Button colorScheme="teal" onClick={handleLinkStrategyToUser}>
                         {selectedStrategyIds.includes(strategy.id) ? 'Link' : 'Unlink'}
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>

              {strategies.map((strategy) => (
                <Checkbox
                  key={strategy.id}
                  isChecked={selectedStrategyIds.includes(strategy.id)}
                  onChange={() => handleStrategySelection(strategy.id)}
                >
                  {strategy.name}
                </Checkbox>
              ))}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleLinkStrategyToUser}>
              Link Strategies
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

       {/* Create Strategy Modal */}
       <Modal isOpen={isCreateStrategyOpen} onClose={onCreateStrategyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Strategy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Check Balance - Display Only */}
            <FormControl mb="4">
              <Flex alignItems="center">
                <FormLabel>Check Balance before trading</FormLabel>
                <Text>{checkBalance || "No Balance"}</Text>
              </Flex>
            </FormControl>

            {/* Hedge Mode - Display Only */}
            <FormControl mb="4">
              <Flex alignItems="center">
                <FormLabel>Hedge Mode</FormLabel>
                <Text>{hedgeMode ? 'Enabled' : 'Disabled'}</Text>
              </Flex>
              {hedgeMode && (
                <Box mt="2" mb="4" p="4" bg="gray.100" borderRadius="md">
                  <p>With Hedge Mode enabled, the bot can open both long and short positions at the same time.</p>
                </Box>
              )}
            </FormControl>
          
            <FormControl mb="4">
              <FormLabel>Strategy Name</FormLabel>
              <Input value={newStrategyName} onChange={(e) => setNewStrategyName(e.target.value)} />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>TradingView Link</FormLabel>
              <Input value={tradingViewLink} onChange={(e) => setTradingViewLink(e.target.value)} />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Trading Pairs (comma-separated)</FormLabel>
              <Input value={tradingPairs} onChange={(e) => setTradingPairs(e.target.value)} />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Trade Direction</FormLabel>
              <Select value={tradeDirection} onChange={(e) => setTradeDirection(e.target.value)}>
                <option value="Long">Long</option>
                <option value="Short">Short</option>
                <option value="Both">Both</option>
              </Select>
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Time Frame</FormLabel>
              <Select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
                <option value="1 Minute">1 Minute</option>
                <option value="5 Minute">5 Minute</option>
                <option value="15 Minute">15 Minute</option>
                <option value="30 Minute">30 Minute</option>
                <option value="1 Hour">1 Hour</option>
                <option value="4 Hour">4 Hour</option>
                <option value="12 Hour">12 Hour</option>
              </Select>
            </FormControl>

            <FormControl mb="4">
              <Flex alignItems="center">
                <FormLabel>Negative Candle Change Trigger (%)</FormLabel>
                <Checkbox isChecked={isNegativeCandleEnabled} onChange={(e) => setIsNegativeCandleEnabled(e.target.checked)}>Enable</Checkbox>
              </Flex>
              {isNegativeCandleEnabled && (
                <NumberInput value={negativeCandleTrigger || 0} onChange={(valueString) => setNegativeCandleTrigger(parseFloat(valueString))}>
                  <NumberInputField />
                </NumberInput>
              )}
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Grid Calls (1-20)</FormLabel>
              <NumberInput min={1} max={20} value={gridCalls || 0} onChange={(valueString) => setGridCalls(parseInt(valueString))}>
                <NumberInputField />
              </NumberInput>
            </FormControl>    

            {/* Loop through each call and display grouped inputs */}
            {Array.from({ length: gridCalls || 0 }, (_, index) => (
              <Box key={index} mt="4" p="4" bg="gray.100" borderRadius="md">
                <Text fontSize="lg" fontWeight="bold">Call {index + 1}</Text>

                {index > 0 && (
                <FormControl mb="4">
                  <FormLabel>Call {index + 1} Funds %</FormLabel>
                  <NumberInput min={0} max={100} value={callFunds[index] || 0} onChange={(valueString) => handleCallFundsChange(index, parseFloat(valueString))}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                )}

               

                {index === 0 && (
                  <FormControl mb="4">
                    <FormLabel>Call {index + 1} Funds %</FormLabel>
                    <NumberInput min={0} max={100} value={call1Funds || 0} onChange={(valueString) => handleCall1FundsChange(parseFloat(valueString))}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                )}

                {index === 0 && (
                  <FormControl mb="4">
                    <FormLabel>Call {index + 1} Funds %</FormLabel>
                    <NumberInput min={0} max={100} value={call1TP || 0} onChange={(valueString) => handleCall1TPChange(parseFloat(valueString))}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                )}

                {index > 0 && (
                  <FormControl mb="4">
                    <FormLabel>Call {index + 1} TP%</FormLabel>
                    <NumberInput min={0} max={100} value={callTPs[index] || 0} onChange={(valueString) => handleCallTPChange(index, parseFloat(valueString))}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                )}
                  

                {/* Call Negative Trigger */}
                {index > 0 && negativeCandleTrigger > 0 && ( // Show only if index > 0, i.e., Call 2 or later
                  <FormControl mb="4">
                    <FormLabel>Call {index + 1} Negative Trigger %</FormLabel>
                    <NumberInput min={-100} max={0} value={callNegTriggers[index] || 0} onChange={(valueString) => handleCallNegTriggerChange(index, parseFloat(valueString))}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                )}

                {index === 0 && (
                  <Button mt="2" colorScheme="blue" onClick={handleSyncCallValues}>
                    Sync Call 1 Values to All
                  </Button>
                )}
                 
              </Box>
            ))}
              <FormControl mb="4">
                <FormLabel>Profit Lock %</FormLabel>
                <NumberInput value={profitLock} onChange={(valueString) => setProfitLock(parseFloat(valueString))}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl mb="4">
                <FormLabel>Stop Loss % (SL%)</FormLabel>
                <NumberInput value={stopLoss} onChange={(valueString) => setStopLoss(parseFloat(valueString))}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl mb="4">
                <FormLabel>Take Profit % (TP%)</FormLabel>
                <NumberInput value={takeProfit} onChange={(valueString) => setTakeProfit(parseFloat(valueString))}>
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
                  </Box>
                )}
              </FormControl>

              <FormControl mb="4">
                <FormLabel>Max Tradable Amount</FormLabel>
                <NumberInput value={maxTradableAmount} onChange={(valueString) => setMaxTradableAmount(parseFloat(valueString))}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl mb="4">
                <FormLabel>Leverage</FormLabel>
                <NumberInput min={1} max={100} value={leverage} onChange={(valueString) => setLeverage(parseInt(valueString))}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>

          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Create Strategy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
