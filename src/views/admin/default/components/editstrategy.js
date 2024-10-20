import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Button
} from '@chakra-ui/react';

const EditStrategyModal = React.memo(({ 
  isCreateStrategyOpen,
  onCreateStrategyClose,
  jwttoken
  
}) => {
  const toast = useToast();
const tradingViewLink = `${process.env.REACT_APP_BACKENDAPI}/api/tradingview-webhook`;
const [newStrategyName, setNewStrategyName] = useState({
  name: false,
  hookkey: ""
  });
const handleNameChange = (e) => {
  setNewStrategyName((prev) => ({ ...prev, name: e.target.value }))
};

const handleHookKeyChange = (e) => {
  setNewStrategyName((prev) => ({ ...prev, hookkey: e.target.value }))
};

  const handleSubmit = async() => {
    const newStrategy = {
      name: newStrategyName.name,
      hookkey: newStrategyName.hookkey
    };
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwttoken}`,
          },
          body:  JSON.stringify(newStrategy),
        });
    
        if (response.ok) {
          toast({
  title: "Strategy created successfully.",
  status: "success",
  duration: 5000,
  isClosable: true,
});
          console.log('Strategy added successfully');
        } else {
          toast({
  title: "Error creating strategy.",
  description: "Please verify the inputs and try again.",
  status: "error",
  duration: 5000,
  isClosable: true,
});
          console.error('Error adding strategy');
        }
      } catch (error) {
        toast({
  title: "Error creating strategy.",
  description: "Please verify the inputs and try again.",
  status: "error",
  duration: 5000,
  isClosable: true,
});
 }

     // setStrategies((prevStrategies) => [...prevStrategies, newStrategy]);
   //  fetchStrategies();
      onCreateStrategyClose();
  };
  
  return (
   <Box mt="4" bg="gray.50" p="4" borderRadius="md">
                  {/* Form Content Goes Here */}
                  <FormControl mb="4">
                    <FormLabel>Strategy Name</FormLabel>
                    <Input value={newStrategyName || ""} onChange={(e) => setNewStrategyName(e.target.value)} />
                  </FormControl>

                  <FormControl mb="4">
                    <FormLabel>Hook Key</FormLabel>
                    <Input value={hookkey || ""} onChange={(e) => setHookKey(e.target.value)} />
                  </FormControl>


                  <FormControl mb="4">
                    <FormLabel>TradingView Link</FormLabel>
                    <Input value={tradingViewLink || ""} isReadOnly />
                  </FormControl>

                  <FormControl mb="4">
                      <FormLabel>Leverage</FormLabel>
                      <NumberInput value={leverage || ""} onChange={(valueString) => setLeverage(isNaN(valueString) ? 0 : valueString)}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    <FormControl mt="4">
                      <FormLabel>Cross/Isolated Mode</FormLabel>
                      <RadioGroup onChange={(value) => setmarginMode(value)} value={marginMode}>
                        <Stack direction="row">
                          <Radio value="CROSSED">Cross</Radio>
                          <Radio value="ISOLATED">Isolated</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>

                  <FormControl mb="4">
                    <FormLabel>Trading Pair</FormLabel>
                    <Select
                      value={tradingPairs}
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
                      <option value="Both">Both</option>
                    </Select>
                  </FormControl>

                  <FormControl mb="4">
                    <FormLabel>Time Frame</FormLabel>
                    <Select value={timeFrame || ''} onChange={(e) => setTimeFrame(e.target.value)}>
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
                    <FormLabel>Initial Call</FormLabel>
                  </FormControl>

                  <Box mt="4" p="4" bg="gray.100" borderRadius="md">

                    <FormControl mb="4">
                      <FormLabel>Initail Call Funds %</FormLabel>
                      <NumberInput value={callFunds[0] || ""} onChange={(valueString) => handleCallFundsChange(0, isNaN(valueString) ? 0 : valueString)}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    <FormControl mb="4">
                      <FormLabel>Initial Call TP%</FormLabel>
                      <InputGroup>
                                <NumberInput 
                                  value={callTPs[0] || ""} onChange={(valueString) => handleCallTPChange(0, isNaN(valueString) ? 0 : valueString)}
                                  width="100%"
                                >
                                  <NumberInputField />
                                </NumberInput>
                                <InputRightElement width="4.5rem">
                                  <Text>{(callTPs[0] * leverage).toFixed(2) || 0}%</Text>
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
                      <Checkbox isChecked={isNegativeCandleEnabled || false} onChange={(e) => setIsNegativeCandleEnabled(e.target.checked)}>Enable</Checkbox>
                    </Flex>
                    {isNegativeCandleEnabled && (
                      <NumberInput value={negativeCandleTrigger || ""} onChange={(valueString) => setNegativeCandleTrigger(parseInt(valueString))}>
                        <NumberInputField />
                      </NumberInput>
                    )}
                  </FormControl>  

                  {/* Loop through each call and display grouped inputs */}
                  {isNegativeCandleEnabled && (
                    Array.from({ length: negativeCandleTrigger }, (_, index) => (
                    <Box key={index} mt="4" p="4" bg="gray.100" borderRadius="md">                 
                      <Text fontSize="lg" fontWeight="bold">Call {index + 1}</Text>   
                          <Box  mb="4" key={index}>

                            <FormControl mb="4">
                              <FormLabel>Call {index + 1} Negative Trigger %</FormLabel>
                              <NumberInput value={callNegTriggers[index + 1] || ""} onChange={(valueString) => handleCallNegTriggerChange(index + 1, isNaN(valueString) ? 0 : valueString)}>
                                <NumberInputField />
                              </NumberInput>
                            </FormControl>

                            <FormControl mb="4">
                              <FormLabel>Call {index + 1} Funds %</FormLabel>
                              <NumberInput  min={0} max={100} value={callFunds[index + 1] || ""} onChange={(valueString) => handleCallFundsChange(index + 1, isNaN(valueString) ? 0 : valueString)}>
                                <NumberInputField />
                              </NumberInput>
                            </FormControl>

                            <FormControl mb="4">
                              <FormLabel>Call {index + 1} TP%</FormLabel>
                              <InputGroup>
                                <NumberInput 
                                  value={callTPs[index + 1] || ""} onChange={(valueString) => handleCallTPChange(index + 1, isNaN(valueString) ? 0 : valueString)}
                                  width="100%"
                                >
                                  <NumberInputField />
                                </NumberInput>
                                <InputRightElement width="4.5rem">
                                  <Text>{(callTPs[index + 1] * leverage).toFixed(2) || 0}%</Text>
                                </InputRightElement>
                              </InputGroup>
                            </FormControl>
                                    <FormControl mb="4">
                      <FormLabel>Profit Lock Settings</FormLabel>
                      <FormLabel>Lock % Trigger</FormLabel>
                      <InputGroup>
                        <NumberInput 
                          value={profitLock?.trigger || ""} 
                          onChange={(valueString) => setProfitLock((prev) => ({ 
                            ...prev, 
                            trigger: isNaN(valueString) ? 0 : valueString 
                          }))}
                          width="100%"
                        >
                          <NumberInputField />
                        </NumberInput>
                        <InputRightElement width="4.5rem">
                          <Text>{(profitLock?.trigger * leverage).toFixed(2) || 0}%</Text>
                        </InputRightElement>
                      </InputGroup>
                      <FormLabel>Lock %</FormLabel>
                      <InputGroup>
                        <NumberInput 
                          value={profitLock?.lockPercent || ""} 
                          onChange={(valueString) => setProfitLock((prev) => ({ 
                            ...prev, 
                            lockPercent: isNaN(valueString) ? 0 : valueString 
                          }))}
                          width="100%"
                        >
                          <NumberInputField />
                        </NumberInput>
                        <InputRightElement width="4.5rem">
                          <Text>{(profitLock?.lockPercent * leverage).toFixed(2) || 0}%</Text>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl mb="4">
                  <FormLabel>Trailing Stop Settings</FormLabel>

                   {/* Enable Trailing Stop */}
                    <Checkbox
                      isChecked={trailingStop?.enabled || false}
                      onChange={(e) =>
                        setTrailingStop((prev) => ({
                          ...prev,
                          enabled: e.target.checked,
                        }))
                      }
                    >
                      Enable Trailing Stop
                    </Checkbox>
                  {/* Callback Rate */}
                  {trailingStop?.enabled && (
                  <Box>
                  <FormLabel>Callback Rate (%)</FormLabel>
                  <NumberInput
                    value={trailingStop?.callbackRate || ""}
                    onChange={(valueString) =>
                      setTrailingStop((prev) => ({
                        ...prev,
                        callbackRate: isNaN(valueString) ? 0 : valueString,
                      }))
                    }
                  >
                    <NumberInputField />
                  </NumberInput>

                  {/* Price */}
                  <FormLabel>Price (offset %)</FormLabel>
                  <NumberInput
                    value={trailingStop?.price || ""}
                    onChange={(valueString) =>
                      setTrailingStop((prev) => ({
                        ...prev,
                        price: isNaN(valueString) ? 0 : valueString,
                      }))
                    }
                  >
                    <NumberInputField />
                  </NumberInput>

                  {/* Amount */}
                  <FormLabel>Amount of funds to be used (in %)</FormLabel>
                  <NumberInput
                    value={trailingStop?.amount || ""}
                    onChange={(valueString) =>
                      setTrailingStop((prev) => ({
                        ...prev,
                        amount: isNaN(valueString) ? 0 : valueString,
                      }))
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                    </Box>
                  )}
                </FormControl>
                    <FormControl>
  <FormLabel>Stop Loss Settings</FormLabel>

  {/* Stop Loss % (Current Trade) */}
  {!stopLoss?.tradableAmount && (
    <>
      <FormLabel>Stop Loss % (Current Trade)</FormLabel>
      <InputGroup>
        <NumberInput
          value={stopLoss?.currentTrade || ""}
          onChange={(valueString) =>
            setStopLoss((prev) => ({
              ...prev,
              currentTrade: isNaN(valueString) ? 0 : valueString,
              tradableAmount: "", // Clear other field
            }))
          }
          width="100%"
        >
          <NumberInputField />
        </NumberInput>
        <InputRightElement width="4.5rem">
          <Text>{(stopLoss?.currentTrade * leverage).toFixed(2) || 0}%</Text>
        </InputRightElement>
      </InputGroup>
    </>
  )}

  {/* Stop Loss % (Tradable Amount) */}
  {!stopLoss?.currentTrade && (
    <>
      <FormLabel>Stop Loss % (Tradable Amount)</FormLabel>
      <InputGroup>
        <NumberInput
          value={stopLoss?.tradableAmount || ""}
          onChange={(valueString) =>
            setStopLoss((prev) => ({
              ...prev,
              tradableAmount: isNaN(valueString) ? 0 : valueString,
              currentTrade: "", // Clear other field
            }))
          }
          width="100%"
        >
          <NumberInputField />
        </NumberInput>
        <InputRightElement width="4.5rem">
          <Text>{(stopLoss?.tradableAmount * leverage).toFixed(2) || 0}%</Text>
        </InputRightElement>
      </InputGroup>
    </>
  )}

                    
                      <FormLabel mt="4">Order Type (for SL/TP)</FormLabel>
                      <Select value={orderType || ""} onChange={(e) => setOrderType(e.target.value)}>
                        <option value="limit">Limit Order</option>
                        <option value="market">Market Order</option>
                      </Select>
                    

                  
                      <Flex mt="4" alignItems="center">
                        <FormLabel>Delayed SL and TP</FormLabel>
                        <Checkbox isChecked={isDelayEnabled.active || false} onChange={(e) => setIsDelayEnabled((prev) => ({ ...prev, active: e.target.checked }))}>Enable</Checkbox>
                      </Flex>
                      {isDelayEnabled.active && (
                        <Box mt="2" mb="4" p="4" bg="gray.100" borderRadius="md">
                          <FormLabel>If enabled, the bot will wait until the price is near the SL/TP before placing a limit order. If the limit order fails, a market order will be executed instead.</FormLabel>
                          <FormLabel>Offset %</FormLabel>
                            <NumberInput value={isDelayEnabled.offset || ""} onChange={(e) => setIsDelayEnabled((prev) => ({ ...prev, offset: isNaN(e) ? 0 : e, }))}>
                              <NumberInputField />
                            </NumberInput>
                        </Box>
                      )}
                    

                    
                    <Flex mt='4' lignItems="center">
                    <FormLabel>Enable Compounding</FormLabel>
                      <Checkbox isChecked={TradableAmount?.compounding || false} onChange={(e) => setTradableAmount((prev) => ({ ...prev, compounding: e.target.checked }))}>Enable</Checkbox>
                    </Flex>
                    <FormLabel>Min Tradable Amount</FormLabel>
                      <NumberInput value={TradableAmount?.min || ""} onChange={(valueString) => setTradableAmount((prev) => ({ ...prev, min: isNaN(valueString) ? 0 : valueString, }))}>
                        <NumberInputField />
                      </NumberInput>
                      <FormLabel>Max Tradable Amount</FormLabel>
                      <NumberInput value={TradableAmount?.max || ""} onChange={(valueString) => setTradableAmount((prev) => ({ ...prev, max: isNaN(valueString) ? 0 : valueString, }))}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                        <Button mt="8" colorScheme="teal" onClick={handleSubmitedit}>
                    Update Strategy
                  </Button>

                            
                          </Box>                 
                    </Box>
                  )))}

  );
});

export default EditStrategyModal;
