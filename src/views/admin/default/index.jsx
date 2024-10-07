// Chakra imports
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
  FormHelperText,
  Input,
  Icon,
  IconButton,
  InputRightElement,
  InputLeftElement,
  InputGroup,
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
  useToast,
  useColorModeValue,
  useDisclosure,
  Switch,
} from "@chakra-ui/react";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/md";
import GeneralExchangeSettingsModal from './components/usersettings';
import TransferModal from './components/Transfer';
import TradePositionTable from './components/PositionsTable';



export default function UserReports() {
  const toast = useToast();
  const navigate = useNavigate();

  const jwttoken = localStorage.getItem("jwtToken");


  const [nameError, setNameError] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');
  const [apiSecretError, setApiSecretError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryvalue, setSearchQueryvalue] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [selectedTradingPairs1, setSelectedTradingPairs1] = useState([]);
  

  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
  const [isLinkStrategyOpen, setLinkStrategyOpen] = useState(false);
  const [expandedStrategyId, setExpandedStrategyId] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState('');



  const { isOpen: isUserOpen, onOpen: onUserOpen, onClose: onUserClose } = useDisclosure();
  const { isOpen: isTransferOpen, onOpen: onTransferOpen, onClose: onTransferClose } = useDisclosure();
  const { isOpen: isCreateStrategyOpen, onOpen: onCreateStrategyOpen, onClose: onCreateStrategyClose } = useDisclosure();
  const { isOpen: isTradingHookTriggerOpen, onOpen: onTradingHookTriggerOpen, onClose: onTradingHookTriggerClose } = useDisclosure();

  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [hookkey, setHookKey] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [newStrategyName, setNewStrategyName] = useState('');
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState([]);
  const [selectedStrategyIds, setSelectedStrategyIds] = useState([]);
  const [transferuserid, setTransferUserId] = useState('');
  const [offset, setOffset] = useState('');
  const [marginMode, setmarginMode] = useState('');


  // new parameters
  
  const [tradingPairs, setTradingPairs] = useState('');
  const [tradeDirection, setTradeDirection] = useState('Both');
  const [timeFrame, setTimeFrame] = useState('1 Minute');
  const [negativeCandleTrigger, setNegativeCandleTrigger] = useState('');
  const [isNegativeCandleEnabled, setIsNegativeCandleEnabled] = useState(false);
  const [gridCalls, setGridCalls] = useState('');
  const [profitLock, setProfitLock] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [trailingStop, setTrailingStop] = useState('');
  const [takeProfit, setTakeProfit] = useState(0);
  const [orderType, setOrderType] = useState('Limit');
  const [isDelayEnabled, setIsDelayEnabled] = useState(false);
  const [isEdit, SetEdit] = useState(false);
  const [useredit, SetUserEdit] = useState(false);   
  const [TradableAmount, setTradableAmount] = useState('');
  const [leverage, setLeverage] = useState(10); // Leverage state
  const [originalStrategy, setOriginalStrategy] = useState(null);
 
  const [callFunds, setCallFunds] = useState(Array(gridCalls || 0).fill(0)); // Funds percentage for each call
  const [callTPs, setCallTPs] = useState(Array(gridCalls || 0).fill(0)); // TP percentage for each call
  const [callNegTriggers, setCallNegTriggers] = useState(Array(gridCalls || 0).fill()); // Negative trigger percentage for each call


  const [accountinfo, setAccountinfo] = useState(0);

  const tradingViewLink = `${process.env.REACT_APP_BACKENDAPI}/api/tradingview-webhook`;
  const [positions, setPositions] = React.useState([]); // Your trade positions data

  const fetchPosition = useCallback(async () => {
    try {        
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/binance/all-open-positions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwttoken}`, // Attach the token
        },
      })

      const data = await response.json();  // Parse the JSON response

      if (!response.ok) {
        console.log("positions error data",data);
        throw new Error(`HTTP error! status: ${response.status}`);
        
      }
      
      setPositions(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }, [jwttoken]);


  const handleClosePosition = async(position) => {

    try {        
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/binance/close-position/${position.userId}/${position.symbol}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwttoken}`, // Attach the token
        },
      })

      const data = await response.json();  // Parse the JSON response

      if (!response.ok) {
        console.log("Closed positions error data",data);
        throw new Error(`HTTP error! status: ${response.status}`);
        
      }
      console.log(data, "closed position success");
      fetchPosition();
    } catch (err) {
      console.error(err, "close posiotn error");
    }
  };

  const fetchPairs = useCallback(async () => {
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
  }, []);



  

   // Handle search query change
   const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQueryvalue(query);
  };



  const handleSelectPair = async (selectedValues, selectedbool) => {

    const boolSelected = selectedbool === 'true';

    console.log("id", selectedValues, !boolSelected );

    const selbool = {
      isSelected: !boolSelected
    }
    try {
      // Send a PUT request to update the selected trading pairs on the server
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/trading-pairs/${selectedValues}/select`, {
        method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
          },
          body:  JSON.stringify(selbool),
      });
  
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

  const fetchAccountinfo = async (accuserid, assetpass) => {
    
    const assetfind = "USDT" || assetpass;

    try {        
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/binance/account-info/${accuserid}/${assetfind}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwttoken}`,
        },
      })
      if (!response.ok) {
        const error = await response.json(); 
        return error.message.msg;
      }
      const data = await response.json();  // Parse the JSON response
      setAccountinfo(data);
      return data;
    } catch (err) {
      console.error(err.message);
      return err.message;
    }
  };

  const fetchtradeinfo = async (usid) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/binance/valid/${usid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwttoken}`,
        },
      })
      const { data } = await response.json();  // Parse the JSON response
      if (!response.ok) {
        const error = await response.json();
        console.log(error);
      }
      // Display enabled permissions
    const permissions = {
      enableReading: data.enableReading,
      enableFutures: data.enableFutures,
      permitsUniversalTransfer: data.permitsUniversalTransfer,
    };

    console.log('User Permissions:', permissions);

    // Display a message for each permission
    Object.entries(permissions).forEach(([key, value]) => {
      if (value) {
        toast({
          title: `${key} Enabled`,
          description: `You have access to ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: `${key} Disabled`,
          description: `You do not have access to ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    });
    } catch (error) {
      const { message } = await error.json();  // Parse the JSON response
      
      console.error('Error fetching Validation info:', error);
      toast({
        title: 'Error',
        description: `There was an issue fetching Validation info. ${JSON.stringify(message)}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const filteredPairs = selectedTradingPairs1.filter(pair =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSelectedPairs = selectedTradingPairs1
  .filter(pair => pair.isSelected === "true") // Filter pairs where isSelected is "true"
  .map(pair => pair.symbol); // Map to get only the symbols


    // Handle pair selection
    const handleSelectPairs = () => {
      setSelectedPairs(filteredSelectedPairs);
    };


  const fetchUsers = useCallback(async () => {
    try {        
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwttoken}`, // Attach the token
        },
      })

      const data = await response.json();  // Parse the JSON response

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

    console.log("user id", id);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwttoken}`, // Attach the token
        },
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

  const fetchStrategies = useCallback(async () => {
    try {        
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategies`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwttoken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();  // Parse the JSON response
      setStrategies(data);
    } catch (err) {
      console.error(err.message);
    }
  }, [jwttoken]);

  const deleteStrategy = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwttoken}`,
        },
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
    if (!jwttoken) {
      navigate("/auth/sign-in"); 
      console.error("No JWT token found");
    }
  },[jwttoken, navigate]);
  
   useEffect(() => {
    fetchUsers();
    fetchStrategies();
    fetchPairs();
    fetchPosition();
  }, [fetchPosition, fetchUsers, fetchStrategies, fetchPairs]);

  useEffect(() => {
    setSelectedPairs(filteredSelectedPairs);
  }, [filteredSelectedPairs])

 const tradinghook = async() => {
    const hooking = { 
      strategy: selectedStrategy,
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

        await fetchPosition();
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
      TradableAmount,
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
            'Authorization': `Bearer ${jwttoken}`,
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

     // setStrategies((prevStrategies) => [...prevStrategies, newStrategy]);
     fetchStrategies();

      console.log("newStrategy", newStrategy);

      onCreateStrategyClose();
    }
  };


      

const handleSubmitedit = async() => {
  
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
      TradableAmount,
      leverage,
      offset,
      marginMode,
    };
  
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
            'Authorization': `Bearer ${jwttoken}`,
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
  };

  const handleCreate = () => {
    // Clear all the form values by resetting them to their initial/default state
    setOriginalStrategy(null); // No original strategy for creation
    setNewStrategyName(''); // Clear strategy name
    setHookKey('');
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
          'Authorization': `Bearer ${jwttoken}`,
        },
        body:  JSON.stringify(activate),
      });
    } catch (error) {
      console.error('Request failed', error);
    }

    console.log("User activate Update", activate);
  }



  const handleactive = async (strategyIdd, currentstatus) => {

    const activate = {
      active: !currentstatus,
    };
    
    try {
      
      await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategy/${strategyIdd}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwttoken}`,
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
      
      const response1 = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/strategy/${editid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwttoken}`,
        }
      });

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
      // setTradableAmount(data1.maxTradableAmount);
      setLeverage(data1.leverage);
      setOffset(data1.offset);
      setmarginMode(data1.marginMode);

    }  catch (error) {
      console.error('Request failed', error);
    }

  }

  const handleEditUser = async(editid) => {

    try {
      
      const response1 = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users/${editid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwttoken}`,
        }
      });

      if (!response1.ok) {
        throw new Error(`HTTP error! status: ${response1.status}`);
      }
      const data1 = await response1.json(); 

      setName(data1.name);
      setApiKey(data1.apiKey);
      setApiSecret(data1.apiSecret)

    }  catch (error) {
      console.error('Request failed', error);
    }

  }


  // Function to validate input
  const validateInputs = () => {
    let isValid = true;

    // Reset errors
    setNameError('');
    setApiKeyError('');
    setApiSecretError('');

    // Validate User Name
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setNameError('User Name can only contain letters, numbers, and underscores.');
      isValid = false;
    }

    // Validate API Key (example: 32 alphanumeric characters)
    if (apiKey.length < 64) {
      setApiKeyError('API Key must be 64 alphanumeric characters.');
      isValid = false;
    }

    // Validate API Secret (example: at least 8 characters)
    if (apiSecret.length < 64) {
      setApiSecretError('API Secret must be at least 64 characters long.');
      isValid = false;
    }

    return isValid;
  };


  const handleAddUser = async() => {
    const newUser = {
      name,
      apiKey,
      apiSecret
    } 

    if (validateInputs() && !useredit) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwttoken}`,
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
    } else {

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users/${useredit}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwttoken}`,
          },
          body: JSON.stringify(newUser),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setUsers([...users, data.user]); // Add the new user to the list
          setApiKey("");
          setApiSecret("");
          SetUserEdit(false);
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
          headers: {
            'Authorization': `Bearer ${jwttoken}`,
          }
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
            'Authorization': `Bearer ${jwttoken}`,
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

  const handleKeyPress = (e) => {
    
    if (e.key === 'Enter') {
      setSearchQuery(e.target.value);

      // Add the current query to the search history if it's not empty
      if (searchQuery.trim()) {
        setSearchHistory((prevHistory) => [searchQuery, ...prevHistory.slice(0, 3)]); // Add new search and limit to 4
      }
    }
  };

  return (
    <Box pt={{ base: "40px", md: "80px", xl: "80px" }}>

      <Box mt={15} position="relative" textAlign="left">
        <Text
          as="span"
          zIndex={1}
          fontSize="2xl"
          fontWeight="bold"
        >
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
            w={{ base: "48px", md: "56px" }} // Responsive width
            h={{ base: "48px", md: "56px" }} // Responsive height
            bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
            icon={<Icon w={{ base: "24px", md: "28px" }} h={{ base: "24px", md: "28px" }} as={MdPerson} color="white" />}
          />
        }
        name="Total users"
        value={users.length}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w={{ base: "48px", md: "56px" }}
            h={{ base: "48px", md: "56px" }}
            bg={boxBg}
            icon={<Icon w={{ base: "28px", md: "32px" }} h={{ base: "28px", md: "32px" }} as={MdAttachMoney} color={brandColor} />}
          />
        }
        name="Active users"
        value={users.filter(user => user.active).length}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w={{ base: "48px", md: "56px" }}
            h={{ base: "48px", md: "56px" }}
            bg={boxBg}
            icon={<Icon w={{ base: "28px", md: "32px" }} h={{ base: "28px", md: "32px" }} as={MdAutorenew} color={brandColor} />}
          />
        }
        name="Active trade(s)"
        value={positions.length || 0}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w={{ base: "48px", md: "56px" }}
            h={{ base: "48px", md: "56px" }}
            bg={boxBg}
            icon={<Icon w={{ base: "28px", md: "32px" }} h={{ base: "28px", md: "32px" }} as={MdShowChart} color={brandColor} />}
          />
        }
        name="Total strategies"
        value={strategies.length}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w={{ base: "48px", md: "56px" }}
            h={{ base: "48px", md: "56px" }}
            bg={boxBg}
            icon={<Icon w={{ base: "28px", md: "32px" }} h={{ base: "28px", md: "32px" }} as={MdCheckCircle} color={brandColor} />}
          />
        }
        name="Active strategies"
        value={strategies.filter(strategy => strategy.active).length}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w={{ base: "48px", md: "56px" }}
            h={{ base: "48px", md: "56px" }}
            bg={boxBg}
            icon={<Icon w={{ base: "28px", md: "32px" }} h={{ base: "28px", md: "32px" }} as={MdMonetizationOn} color={brandColor} />}
          />
        }
        name="Total ROI"
        value="0"
      />
    </SimpleGrid>


    <Box mt={5} position="relative" textAlign="left">
        <Text
          as="span"
          zIndex={1}
          fontSize="2xl"
          fontWeight="bold"
        >
          PAIRS
        </Text>
        <Divider
          mt={-1} // Move the divider up to align with the text
          borderColor="black.400"
          borderWidth="1px"
        />
      </Box>

       {/* Dropdown Button */}
       <Menu>
        <MenuButton mt={5} as={Button} leftIcon={<Icon as={MdPerson} />} colorScheme="teal">
          Add Trading Pairs
        </MenuButton>



        <MenuList p={4} width="300px">
          {/* Search Bar */}
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

          {/* Checkbox List for Trading Pairs */}
          <CheckboxGroup value={selectedPairs} onChange={handleSelectPairs}>
            <Stack spacing={3}>
              {filteredPairs.map((pair) => (
                <Checkbox key={pair._id} value={pair.symbol}  isChecked={pair.isSelected} onChange={() => { handleSelectPair(pair._id, pair.isSelected);}}>
                  {pair.symbol}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </MenuList>
      </Menu>
      {/* Section to show added trading pairs */}
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

      <Box mt={5} position="relative" textAlign="left">
        <Text
          as="span"
          zIndex={1}
          fontSize="2xl"
          fontWeight="bold"
        >
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
          onClick={()=> {SetUserEdit(""); onUserOpen();}}
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

      <Modal isOpen={isTradingHookTriggerOpen} onClose={onTradingHookTriggerClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Trading Hook Trigger</ModalHeader>
        <ModalCloseButton />
        <ModalBody>

          <FormControl>
            <FormLabel>Select Strategy</FormLabel>
            <Select placeholder="Select strategy" value={selectedStrategy} onChange={(e) => setSelectedStrategy(e.target.value)}>
              {strategies.map((strategy) => (
                <option key={strategy.id} value={strategy.hookkey}>
                  {strategy.name}
                </option>
              ))}
            </Select>
          </FormControl>

        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={tradinghook}>
            Trigger Hook
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>


      
     {/* Add User Modal */}
     <Modal isOpen={isUserOpen} onClose={onUserClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> {useredit ? 'Edit User' : 'Add User'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!nameError}>
              <FormLabel>User Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              {nameError && <FormHelperText color="red.500">{nameError}</FormHelperText>}
            </FormControl>
            <FormControl isInvalid={!!apiKeyError}>
              <FormLabel>API Key</FormLabel>
              <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              {apiKeyError && <FormHelperText color="red.500">{apiKeyError}</FormHelperText>}
            </FormControl>
            <FormControl mt="4" isInvalid={!!apiSecretError} >
              <FormLabel>API Secret</FormLabel>
              <Input value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} />
              {apiSecretError && <FormHelperText color="red.500">{apiSecretError}</FormHelperText>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleAddUser}>
              {useredit ? 'Edit User' : 'Add User'}
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
                  <MenuItem onClick={() => { setSelectedStrategyId(user.id); setSelectedStrategyIds(user.strategyIds.map(id => strategies.find(s => s.id === id)?.id)); setLinkStrategyOpen((prev) => (prev === user.id ? null : user.id)); }}>Link Strategies</MenuItem>
                  <MenuItem onClick={() => { fetchAccountinfo(user.id); setTransferUserId(user.id); setIsGeneralSettingsOpen((prev) => (prev === user.id ? null : user.id));}}>User/Exchange Settings</MenuItem>
                  <MenuItem onClick={() => { fetchAccountinfo(user.id); setTransferUserId(user.id); onTransferOpen((prev) => (prev === user.id ? null : user.id)); }}>Internal Transfer</MenuItem>
                  <MenuItem onClick={() => { SetUserEdit(user.id); handleEditUser(user.id); onUserOpen()}}>Edit User</MenuItem>
                  <MenuItem onClick={() => fetchtradeinfo(user.id) }>Validate API connection</MenuItem>
                  <MenuItem onClick={() => deleteuser(user.id) }>Delete User</MenuItem>
                  
                </MenuList>
              </Menu>
            </Flex>
            <Switch
                isChecked={user?.active}
                onChange={() =>  handleuseractive(user.id, user.active)}
                colorScheme="teal"
              />

            <Box mt="4">
              <Text>User Name: {user?.name}</Text>
              <Text>Strategies: {user.strategyIds.map(id => strategies.find(s => s.id === id)?.name || 'None').join(', ')}</Text>
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
                  {/* Form Content Goes Here */}
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
                  </Box>
            )}
             {transferuserid === user.id && (
                <Box mt="4" bg="gray.50" p="4" borderRadius="md">
                  <TransferModal isOpen={isTransferOpen} onClose={onTransferClose} userid={transferuserid} balance={accountinfo} fetchAccountinfo={fetchAccountinfo(transferuserid)}/>
                </Box>
              )}
          </Box>         
        ))}
      </SimpleGrid>



      
{/*       <TransferModal isOpen={isTransferOpen} onClose={onTransferClose} balance={accountinfo} userid={transferuserid} fetchAccountinfo={fetchAccountinfo(transferuserid)}/>
 */}
      <Box mt={5} position="relative" textAlign="left">
        <Text
          as="span"
          zIndex={1}
          fontSize="2xl"
          fontWeight="bold"
        >
          STRATEGIES
        </Text>
        <Divider
          mt={-1} // Move the divider up to align with the text
          borderColor="black.400"
          borderWidth="1px"
        />
      </Box>

      <Button
          mt="20px"
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
                    <FormLabel>Initial Call</FormLabel>
                  </FormControl>

                  <Box mt="4" p="4" bg="gray.100" borderRadius="md">

                    <FormControl mb="4">
                      <FormLabel>Initail Call Funds %</FormLabel>
                      <NumberInput min={0} max={100} value={callFunds[0] || ""} onChange={(valueString) => handleCallFundsChange(0, isNaN(valueString) ? 0 : valueString)}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    <FormControl mb="4">
                      <FormLabel>Initial Call TP%</FormLabel>
                      <NumberInput min={0} max={100} value={callTPs[0] || ""} onChange={(valueString) => handleCallTPChange(0, isNaN(valueString) ? 0 : valueString)}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    {/* Sync Call 1 Values */}
                    <Button mt="2" colorScheme="blue" onClick={handleSyncCallValues}>
                      Sync Initial Call Values to All
                    </Button>
                  </Box> 

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
                                  <Text>{callTPs[index + 1] * leverage || 0}%</Text>
                                </InputRightElement>
                              </InputGroup>
                            </FormControl>

                            
                          </Box>                 
                    </Box>
                  )))}
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
                          <Text>{profitLock?.trigger * leverage || 0}%</Text>
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
                          <Text>{profitLock?.lockPercent * leverage || 0}%</Text>
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


                    <FormControl mb="4">
                    <FormLabel>Stop Loss Settings</FormLabel>
                      <FormLabel>Stop Loss % (Current Trade)</FormLabel>
                      <InputGroup>
                        <NumberInput 
                          value={stopLoss?.currentTrade || ""} onChange={(valueString) => setStopLoss((prev) => ({ ...prev, currentTrade: isNaN(valueString) ? 0 : valueString, }))}
                          width="100%"
                        >
                          <NumberInputField />
                        </NumberInput>
                        <InputRightElement width="4.5rem">
                          <Text>{stopLoss?.currentTrade * leverage || 0}%</Text>
                        </InputRightElement>
                      </InputGroup>
                      <FormLabel>Stop Loss % (Tradable Amount)</FormLabel>
                      <InputGroup>
                        <NumberInput 
                          value={stopLoss?.tradableAmount || ""} onChange={(valueString) => setStopLoss((prev) => ({ ...prev, tradableAmount: isNaN(valueString) ? 0 : valueString, }))}
                          width="100%"
                        >
                          <NumberInputField />
                        </NumberInput>
                        <InputRightElement width="4.5rem">
                          <Text>{stopLoss?.currentTrade * leverage || 0}%</Text>
                        </InputRightElement>
                      </InputGroup>
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
                          <FormLabel>If enabled, the bot will wait until the price is near the SL/TP before placing a limit order. If the limit order fails, a market order will be executed instead.</FormLabel>
                          <FormLabel>Offset %</FormLabel>
                            <NumberInput value={offset || ""} onChange={(valueString) => setOffset(isNaN(valueString) ? 0 : valueString)}>
                              <NumberInputField />
                            </NumberInput>
                        </Box>
                      )}
                    </FormControl>

                    <FormControl mb="4">
                    <FormLabel>Enable Compounding</FormLabel>
                      <Checkbox isChecked={TradableAmount?.compounding} onChange={(e) => setTradableAmount((prev) => ({ ...prev, compounding: isNaN(e.target.checked) ? 0 : e.target.checked, }))}>Enable</Checkbox>
                    
                    <FormLabel>Min Tradable Amount</FormLabel>
                      <NumberInput value={TradableAmount?.min || ""} onChange={(valueString) => setTradableAmount((prev) => ({ ...prev, min: isNaN(valueString) ? 0 : valueString, }))}>
                        <NumberInputField />
                      </NumberInput>
                      <FormLabel>Max Tradable Amount</FormLabel>
                      <NumberInput value={TradableAmount?.max || ""} onChange={(valueString) => setTradableAmount((prev) => ({ ...prev, max: isNaN(valueString) ? 0 : valueString, }))}>
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    
                  <Button mt="4" colorScheme="teal" onClick={handleSubmitedit}>
                    Update Strategy
                  </Button>
                </Box>
              )}
          </Box>
        ))}
      </SimpleGrid>

      
       {/* Create Strategy Modal */}
       <Modal isOpen={isCreateStrategyOpen} onClose={onCreateStrategyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Strategy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

          <FormControl>
              <FormLabel>Strategy Name</FormLabel>
              <Input value={newStrategyName} onChange={(e) => setNewStrategyName(e.target.value)} />
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
              Create Strategy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      <Box mt={5} position="relative" textAlign="left">
        <Text
          as="span"
          zIndex={1}
          fontSize="2xl"
          fontWeight="bold"
        >
          TRADES
        </Text>
        <Divider
          mt={-1} // Move the divider up to align with the text
          borderColor="black.400"
          borderWidth="1px"
        />
        <TradePositionTable positions={positions?.positions} onClosePosition={handleClosePosition} />

      </Box>

    </Box>
  );
}
