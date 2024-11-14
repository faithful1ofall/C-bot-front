import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Checkbox,
  Divider,
  Flex,
  Stack,
  Text,
  InputRightElement,
  Icon,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  RadioGroup,
  Radio,
  Select,
  Input,
  InputGroup,
  useToast,
  Button,
} from '@chakra-ui/react';
import {
  MdArrowBack, MdLink
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';

const EditStrategyForm = React.memo(
  () => {

    const strategyid = localStorage.getItem('strategyid');

    const pair = localStorage.getItem('selectpairs');

    const selectedPairs = pair.split(',');
 
    const jwttoken = localStorage.getItem('jwtToken');
    const toast = useToast();
    const tradingViewLink = `${process.env.REACT_APP_BACKENDAPI}/api/tradingview-webhook`;
    const [originalStrategy, setOriginalStrategy] = useState();
    const [newStrategyName, setNewStrategyName] = useState({
      name: false,
      hookkey: '',
      tradingPairs: ``,
      tradeDirection: '',
      timeFrame: '',
      negativeCandleTrigger: null,
      isNegativeCandleEnabled: false,
      calls: [{
        funds: '',
        tp: '',
        negTrigger: '',
      }],
      trailingStop: {
        enabled: false,
        callbackRate: 0,
        price: 0,
        amount: 0,
      },
      profitLock: {
        trigger: 0,
        lockPercent: 0,
      },
      stopLoss: {
        currentTrade: 0,
        tradableAmount: 0,
      },
      takeProfit: '',
      orderType: '',
      callorderType: 'limit',
      isDelayEnabled: {
        active: false,
        offset: 0,
      },
      TradableAmount: {
        min: 0,
        max: 0,
        compounding: false,
      },
      leverage: '',
      slforceclose: true,
      tpforceclose: true,
      marginMode: '',
    });

    const handleEdit = useCallback(async (editid) => {
      try {
        const response1 = await fetch(
          `${process.env.REACT_APP_BACKENDAPI}/api/strategy/${editid}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwttoken}`,
            },
          },
        );
  
        if (!response1.ok) {
          throw new Error(`HTTP error! status: ${response1.status}`);
        }
  
        const data1 = await response1.json();
  
        setOriginalStrategy(data1);
        setNewStrategyName((prevState) => ({
  ...prevState,
  ...data1,
  tradingPair: data1.tradingPair || 'ETHUSDT', // Default if not provided
          orderType: data1.orderType || 'market',
          callorderType: data1.callorderType || 'market',
  marginMode: data1.marginMode || 'CROSSED', // Default if not provided
  timeFrame: data1.timeFrame || '15s', // Default if not provided
  tradeDirection: data1.tradeDirection || 'Buy', // Default if not provided
  isNegativeCandleEnabled: data1.isNegativeCandleEnabled !== undefined ? data1.isNegativeCandleEnabled : false, // Use undefined check
          slforceclose: data1.slforceclose !== undefined ? data1.slforceclose: true,
          tpforceclose: data1.tpforceclose !== undefined ? data1.tpforceclose: true,
}));
        
          
      } catch (error) {
        console.error('Request failed', error);
      }
    }, [jwttoken]);

    useEffect(() => {
      handleEdit(strategyid);
    }, [handleEdit, strategyid]);

    const handleSyncCallValues = () => {
      const callsCount = newStrategyName.negativeCandleTrigger + 1;
      setNewStrategyName((prevState) => {
        const firstCall = prevState.calls[0]; // Get the values from Call 0
        const updatedCalls = [...prevState.calls]; // Create a copy of the existing calls array

        for (let i = 1; i < callsCount; i++) { // Start from 1 to skip Call 0
          updatedCalls[i] = {
            ...updatedCalls[i], // Preserve existing properties
            funds: firstCall.funds, // Sync funds
            tp: firstCall.tp,       // Sync TP
            negTrigger: firstCall.negTrigger, // Sync negative trigger
            
          };
        }

        return {
          ...prevState,
          calls: updatedCalls, // Update calls with synced values
        };
      });
    };


    const handleNestedChange = (section, field, value) => {
      console.log(value);
      setNewStrategyName((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section], // copy the previous state for the section (nested object)
          [field]: value, // update the specific field in the nested object
        },
      }));
    };
    

    const handleChange = (field, value) => {
      console.log(value);
      setNewStrategyName((prevState) => ({
        ...prevState,
        [field]: value, // dynamically updates the field
      }));
    };

    const handleStopLossChange = (field, valueString) => {
      console.log(valueString);
      setNewStrategyName((prevState) => ({
        ...prevState,
        stopLoss: {
          ...prevState.stopLoss,
          [field]: isNaN(valueString) ? 0 : valueString, // Update the current field
          [field === 'currentTrade' ? 'tradableAmount' : 'currentTrade']: '', // Clear the other field
        },
      }));
    };
    

    const handleCallChange = (index, field, value) => {
      console.log(value);
      setNewStrategyName((prevState) => {
        const updatedCalls = [...prevState.calls]; // Create a copy of the calls array
        updatedCalls[index] = {
          ...updatedCalls[index], // Copy the existing call object
          [field]: value, // Update the specific field
        };
        
        return {
          ...prevState,
          calls: updatedCalls, // Update the calls array in the state
        };
      });
    };

    const handleApply = async () => {
      try {
        await fetch(
          `${process.env.REACT_APP_BACKENDAPI}/api/binance/applystrategy/${strategyid}`);
        toast({
          title: 'Strategy update Applied successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Failed to Apply update strategy.',
          description: 'Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }

    const handleSubmit = async () => {
      const newStrategy = newStrategyName;

      // Create an object with only the changed fields
      const updatedFields = {};

       Object.keys(newStrategy).forEach((key) => {
        if (newStrategy[key] !== originalStrategy[key]) {
          updatedFields[key] = newStrategy[key];
        }
      });

      try {
        await fetch(
          `${process.env.REACT_APP_BACKENDAPI}/api/strategy/${strategyid}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwttoken}`,
            },
            body: JSON.stringify(updatedFields),
          },
        );
        toast({
          title: 'Strategy updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Failed to update strategy.',
          description: 'Please check the inputs and try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    const tradinghook = async (strategykey) => {
        const hooking = {
          strategy: strategykey,
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

            const hasErrors = Object.values(data.data.msg).some((messages) => messages.length > 0);
    
          if (data.data.msg && Object.keys(data.data.msg).length > 0 && hasErrors) {
            // Concatenate all error messages from data.errors array into one string
            const allErrorMessages = Object.entries(data.data.msg).map(([userId, messages]) => {
              // Join each user's error messages into a single line
              const userErrors = messages.map((msg) => `• ${msg.msg || "Unknown error"}`).join('\n');
              return `User ID ${userId}:\n${userErrors || "no error to display"} `;
            }).join('\n\n'); // Separate each user's errors with extra newline for readability

              
            // Display a single toast with all error messages
            toast({
              title: 'Trade hook errors encountered.',
              description: allErrorMessages,
              status: 'error',
              duration: 16000,
              isClosable: true,
            });
          } else {
            // If no errors, display a success message
            toast({
              title: 'Trade hook successful.',
              description: 'Trade executed successfully.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          }
                    
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

    return (
      <Box mt="20" bg="gray.50" p="4" borderRadius="md">

      <Flex align="left" mb="4" justify="flex-start" flexWrap="wrap">
  {/* Back to Home Link */}
  <NavLink to="/admin/strategylist" display="flex" alignItems="center" mb={{ base: 2, md: 0 }}>
    <Icon as={MdArrowBack} mr="2" /> {/* Back Icon */}
    <Text color="blue.500">strategies</Text>
  </NavLink>
{/* Divider */}
  <Divider orientation="vertical" mx={2} height="20px" borderColor="gray.300" display={{ base: "none", md: "block" }} />

  {/* Webhook Button */}
  <Button
    leftIcon={<MdLink />}
    colorScheme="teal"
    variant="solid"
    size="sm"
    onClick={() => tradinghook(newStrategyName.hookkey || '')}
    mb={{ base: 2, md: 0 }}
  >
    Test Webhook
  </Button>
  </Flex>

  
        {/* Form Content Goes Here */}
        <FormControl mb="4">
          <FormLabel>Strategy Name</FormLabel>
          <Input
            value={newStrategyName.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Hook Key</FormLabel>
          <Input
            value={newStrategyName.hookkey || ''}
            onChange={(e) => handleChange('hookkey', e.target.value)}
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>TradingView Link</FormLabel>
          <Input value={tradingViewLink || ''} isReadOnly />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Leverage</FormLabel>
          <NumberInput
            value={newStrategyName.leverage || ''}
            onChange={(e) => handleChange('leverage', e)}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl mt="4">
          <FormLabel>Cross/Isolated Mode</FormLabel>
          <RadioGroup
            onChange={(e) => handleChange('marginMode', e)}
            value={newStrategyName.marginMode}
          >
            <Stack direction="row">
              <Radio value="CROSSED">Cross</Radio>
              <Radio value="ISOLATED">Isolated</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Trading Pair</FormLabel>
          <Select
            value={newStrategyName.tradingPair}
            onChange={(e) => handleChange('tradingPair', e.target.value)}
          >
            {selectedPairs?.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Trade Direction</FormLabel>
          <Select
            value={newStrategyName.tradeDirection}
            onChange={(e) => handleChange('tradeDirection', e.target.value)}
          >
            <option value="Buy">Long/Buy</option>
            <option value="Sell">Short/Sell</option>
            <option value="Both">Both</option>
          </Select>
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Time Frame</FormLabel>
          <Select
            value={newStrategyName.timeFrame || ''}
            onChange={(e) => handleChange('timeFrame', e.target.value)}
          >
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
          <FormLabel>Initial Entry</FormLabel>
        </FormControl>

        <Box mt="4" p="4" bg="gray.100" borderRadius="md">
          <FormControl mb="4">
            <FormLabel>Initail Entry Funds %</FormLabel>
            <NumberInput
              value={newStrategyName.calls[0]?.funds || ''}
              onChange={(valueString) => handleCallChange(0, 'funds', isNaN(valueString) ? 0 : valueString)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl mb="4">
              <Flex alignItems="center">
            <FormLabel>Enable Take Profit Force Close</FormLabel>
              <Checkbox
              isChecked={newStrategyName.tpforceclose || false}
              onChange={(e) => handleChange('tpforceclose', e.target.checked)}
            >
              Enable
            </Checkbox>
                </Flex>
            <FormLabel>Initial Entry TP%</FormLabel>
            <InputGroup>
              <NumberInput
                value={newStrategyName.calls[0]?.tp || ''}
                onChange={(valueString) => handleCallChange(0, 'tp', isNaN(valueString) ? 0 : valueString)}
                width="100%"
              >
                <NumberInputField />
              </NumberInput>
              <InputRightElement width="4.5rem">
                <Text>{(newStrategyName.calls[0]?.tp * newStrategyName.leverage).toFixed(2) || 0}%</Text>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          {/* Sync Call 1 Values */}
          <Button mt="2" colorScheme="blue" onClick={handleSyncCallValues}>
            Sync Initial Call Values to All
          </Button>
        </Box>

        <FormControl mb="4">
          <Flex alignItems="center">
            <FormLabel>Negative Value Trigger (%)</FormLabel>
            <Checkbox
              isChecked={newStrategyName.isNegativeCandleEnabled || false}
              onChange={(e) => handleChange('isNegativeCandleEnabled', e.target.checked)}
            >
              Enable
            </Checkbox>
          </Flex>
          {newStrategyName.isNegativeCandleEnabled && (
            <div>
            <NumberInput
              value={newStrategyName.negativeCandleTrigger || ''}
              onChange={(e) => handleChange('negativeCandleTrigger', e)}
            >
              <NumberInputField />
            </NumberInput>
                <FormLabel mt="4">calls Order Type </FormLabel>
          <Select
            value={newStrategyName.callorderType || ''}
            onChange={(e) => handleChange('callorderType', e.target.value)}
          >
            <option value="limit">Limit Order</option>
            <option value="market">Market Order</option>
          </Select>
            {newStrategyName.callorderType === 'market' && (
  <Text mt="2" fontStyle="italic" bg="gray.100" p="2" borderRadius="md">
    Market Order will use the selected time frame
  </Text>
)}
                </div>
          )}
        </FormControl>

        {/* Loop through each call and display grouped inputs */}
        {newStrategyName.isNegativeCandleEnabled &&
          Array.from({ length: newStrategyName.negativeCandleTrigger }, (_, index) => (
            <Box key={index} mt="4" p="4" bg="gray.100" borderRadius="md">
              <Text fontSize="lg" fontWeight="bold">
                Call {index + 1}
              </Text>
              <Box mb="4" key={index}>
                <FormControl mb="4">
                  <FormLabel>Call {index + 1} Negative Trigger %</FormLabel>
                  <InputGroup>
                    <NumberInput
                      value={newStrategyName.calls[index + 1]?.negTrigger || ''}
                      onChange={(valueString) => handleCallChange(index + 1, 'negTrigger', isNaN(valueString) ? 0 : valueString)}
                    >
                      <NumberInputField />
                    </NumberInput>
                    <InputRightElement width="4.5rem">
                        <Text>
                          {(newStrategyName.calls[index + 1]?.negTrigger * newStrategyName.leverage).toFixed(2) || 0}%
                        </Text>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl mb="4">
                  <FormLabel>Call {index + 1} Funds %</FormLabel>
                  <NumberInput
                    min={0}
                    max={100}
                    value={newStrategyName.calls[index + 1]?.funds || ''}
                    onChange={(valueString) => handleCallChange(index + 1, 'funds', isNaN(valueString) ? 0 : valueString)}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>

                <FormControl mb="4">
                  <FormLabel>Call {index + 1} TP%</FormLabel>
                  <InputGroup>
                    <NumberInput
                      value={newStrategyName.calls[index + 1]?.tp || ''}
                      onChange={(valueString) => handleCallChange(index + 1, 'tp', isNaN(valueString) ? 0 : valueString)}
                      width="100%"
                    >
                      <NumberInputField />
                    </NumberInput>
                    <InputRightElement width="4.5rem">
                      <Text>
                        {(newStrategyName.calls[index + 1]?.tp * newStrategyName.leverage).toFixed(2) || 0}%
                      </Text>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Box>
            </Box>
          ))}
        <FormControl mb="4">
          <FormLabel>Profit Lock Settings</FormLabel>
          <FormLabel>Lock % Trigger</FormLabel>
          <InputGroup>
            <NumberInput
              value={newStrategyName.profitLock?.trigger || ''}
              onChange={(e) => handleNestedChange('profitLock', 'trigger', e)}
              width="100%"
            >
              <NumberInputField />
            </NumberInput>
            <InputRightElement width="4.5rem">
              <Text>{(newStrategyName.profitLock?.trigger * newStrategyName.leverage).toFixed(2) || 0}%</Text>
            </InputRightElement>
          </InputGroup>
          <FormLabel>Lock %</FormLabel>
          <InputGroup>
            <NumberInput
              value={newStrategyName.profitLock?.lockPercent || ''}
              onChange={(e) => handleNestedChange('profitLock', 'lockPercent', e)}
              width="100%"
            >
              <NumberInputField />
            </NumberInput>
            <InputRightElement width="4.5rem">
              <Text>
                {(newStrategyName.profitLock?.lockPercent * newStrategyName.leverage).toFixed(2) || 0}%
              </Text>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Trailing Stop Settings</FormLabel>

          {/* Enable Trailing Stop */}
          <Checkbox
            isChecked={newStrategyName.trailingStop?.enabled || false}
            onChange={(e) => handleNestedChange('trailingStop', 'enabled', e.target.checked)}
          >
            Enable Trailing Stop
          </Checkbox>
          {/* Callback Rate */}
          {newStrategyName.trailingStop?.enabled && (
            <Box>
              <FormLabel>Callback Rate (%)</FormLabel>
              <NumberInput
                value={newStrategyName.trailingStop?.callbackRate || ''}
                onChange={(e) => handleNestedChange('trailingStop', 'callbackRate', e)}
              >
                <NumberInputField />
              </NumberInput>

              {/* Price */}
              <FormLabel>Price (offset %)</FormLabel>
              <NumberInput
                value={newStrategyName.trailingStop?.price || ''}
                onChange={(e) => handleNestedChange('trailingStop', 'price', e)}
              >
                <NumberInputField />
              </NumberInput>

              {/* Amount */}
              <FormLabel>Amount of funds to be used (in %)</FormLabel>
              <NumberInput
                value={newStrategyName.trailingStop?.amount || ''}
                onChange={(e) => handleNestedChange('trailingStop', 'amount', e)}
              >
                <NumberInputField />
              </NumberInput>
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Stop Loss Settings</FormLabel>
            <Flex alignItems="center">
<FormLabel>Enable Stop Loss Force Close</FormLabel>
              <Checkbox
              isChecked={newStrategyName.slforceclose || false}
              onChange={(e) => handleChange('slforceclose', e.target.checked)}
            >
              Enable
            </Checkbox>
                </Flex>

          {/* Stop Loss % (Current Trade) */}
          {!newStrategyName.stopLoss?.tradableAmount && (
            <>
              <FormLabel>Stop Loss % (Current Trade)</FormLabel>
              <InputGroup>
                <NumberInput
                  value={newStrategyName.stopLoss?.currentTrade || ''}
                  onChange={(valueString) => handleStopLossChange('currentTrade', valueString)}
                  width="100%"
                >
                  <NumberInputField />
                </NumberInput>
                <InputRightElement width="4.5rem">
                  <Text>
                    {(newStrategyName.stopLoss?.currentTrade * newStrategyName.leverage).toFixed(2) || 0}%
                  </Text>
                </InputRightElement>
              </InputGroup>
            </>
          )}

          {/* Stop Loss % (Tradable Amount) */}
          {!newStrategyName.stopLoss?.currentTrade && (
            <>
              <FormLabel>Stop Loss % (Tradable Amount)</FormLabel>
              <InputGroup>
                <NumberInput
                  value={newStrategyName.stopLoss?.tradableAmount || ''}
                  onChange={(valueString) => handleStopLossChange('tradableAmount', valueString)}
                  width="100%"
                >
                  <NumberInputField />
                </NumberInput>
                <InputRightElement width="4.5rem">
                  <Text>
                    {(newStrategyName.stopLoss?.tradableAmount * newStrategyName.leverage).toFixed(2) || 0}%
                  </Text>
                </InputRightElement>
              </InputGroup>
            </>
          )}

          <FormLabel mt="4">Order Type (for SL/TP)</FormLabel>
          <Select
            value={newStrategyName.orderType || ''}
            onChange={(e) => handleChange('orderType', e.target.value)}
          >
            <option value="limit">Limit Order</option>
            <option value="market">Market Order</option>
          </Select>

          <Flex mt="4" alignItems="center">
            <FormLabel>Delayed SL and TP</FormLabel>
            <Checkbox
              isChecked={newStrategyName.isDelayEnabled?.active || false}
              onChange={(e) => handleNestedChange('isDelayEnabled', 'active', e.target.checked)}
            >
              Enable
            </Checkbox>
          </Flex>
          {newStrategyName.isDelayEnabled?.active && (
            <Box mt="2" mb="4" p="4" bg="gray.100" borderRadius="md">
              <FormLabel>
                If enabled, the bot will wait until the price is near the SL/TP
                before placing a limit order. If the limit order fails, a market
                order will be executed instead.
              </FormLabel>
              <FormLabel>Offset %</FormLabel>
              <InputGroup>
              <NumberInput
                value={newStrategyName.isDelayEnabled?.offset || ''}
                onChange={(e) => handleNestedChange('isDelayEnabled', 'offset', e)}
              >
                <NumberInputField />
              </NumberInput>
              <InputRightElement width="4.5rem">
              <Text>{(newStrategyName.isDelayEnabled?.offset * newStrategyName.leverage).toFixed(2) || 0}%</Text>
            </InputRightElement>
          </InputGroup>
            </Box>
          )}

          <Flex mt="4" alignItems="center">
            <FormLabel>Enable Compounding</FormLabel>
            <Checkbox
              isChecked={newStrategyName.TradableAmount?.compounding || false}
              onChange={(e) => handleNestedChange('TradableAmount', 'compounding', e.target.checked)}
            >
              Enable
            </Checkbox>
          </Flex>
          <FormLabel>Min Tradable Amount</FormLabel>
          <NumberInput
            value={newStrategyName.TradableAmount?.min || ''}
            onChange={(e) => handleNestedChange('TradableAmount', 'min', e)}
          >
            <NumberInputField />
          </NumberInput>
          <FormLabel>Max Tradable Amount</FormLabel>
          <NumberInput
            value={newStrategyName.TradableAmount?.max || ''}
            onChange={(e) => handleNestedChange('TradableAmount', 'max', e)}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <Button mt="8" colorScheme="teal" onClick={handleSubmit}>
          Update Strategy
        </Button>
        <Button mt="8" ml="8" colorScheme="teal" onClick={handleApply}>
          Apply Now
        </Button>
      </Box>
    );
  },
);

export default EditStrategyForm;
