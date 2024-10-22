import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  Checkbox,
  Text,
  RadioGroup,
  Radio,
  useToast,
  Stack
} from '@chakra-ui/react'; // Assuming you're using Chakra UI

const GeneralExchangeSettingsModal = ({ balance, userid }) => {
  
  const [settings, setSettings] = useState({});
  
  const toast = useToast();
  
  const [originalsettings, setOriginalSettings] = useState(null);

  const {  stickSettings, hedgeMode, assetMode } = settings;
  const jwttoken = localStorage.getItem("jwtToken");

  const fetchSettings = useCallback(async (useridset) => {
    if(useridset){
      try {        
        const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users/${useridset}/settings`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwttoken}`,
          }
        });
        
        if (!response.ok) {
          
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSettings(data.settings);
        setOriginalSettings(data.settings);
      } catch (err) {
        console.error(err.message);
      }
    }    
  }, [jwttoken]);

  useEffect(() => {
    fetchSettings(userid);
  }, [fetchSettings, userid]);

  const handleSave = async () => {

    const updatedFields = {};

console.log("COMPARE", settings, originalsettings);

// Check if originalsettings exists
if (originalsettings) {
  Object.keys(settings).forEach((key) => {
    if (settings[key] !== originalsettings[key]) {
      updatedFields[key] = settings[key];
    }
  });
} else {
  // If originalsettings is not set, treat all settings as updated
  Object.assign(updatedFields, settings);
}

console.log("Updated Fields", updatedFields);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users/${userid}/settings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwttoken}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        toast({
  title: "Error saving Settings.",
  status: "error",
  duration: 5000,
  isClosable: true,
});
        throw new Error('Settings save failed');
      }

      const data = await response.json();
      console.log('Settings save successful:', data);
      toast({
  title: "Settings saved successfully.",
  status: "success",
  duration: 5000,
  isClosable: true,
});
      // Reset modal state after success
    } catch (error) {
      console.error('Settings error:', error);
      toast({
  title: "Error saving Settings.",
  status: "error",
  duration: 5000,
  isClosable: true,
});
    }
  };


  return (
    <Box mt="4" bg="gray.50" p="4" borderRadius="md">
        <Text>General Exchange Settings</Text>
          {/* Futures Account Type */}
          <FormControl mt="4">
            <FormLabel>Futures Account Type</FormLabel>
            <Text>Default: USD-M futures</Text>
          </FormControl>

          {/* User Account Balance */}
          <FormControl mt="4">
            <FormLabel>User Account Balance</FormLabel>
            <Text>Available balance in Futures Account (USDT): {balance?.balance?.availableBalance || 0} USDT</Text>
          </FormControl>


          {/* Hedge Mode / One Way Mode */}
          <FormControl mt="4">
            <FormLabel>Hedge Mode/One Way Mode</FormLabel>
            <RadioGroup
  onChange={(value) => setSettings({ ...settings, hedgeMode: value === "true" })}
  value={hedgeMode ? "true" : "false"}
>
  <Stack direction="row">
                <Radio value="false">One Way</Radio>
                <Radio value="true">Hedge Mode</Radio>
              </Stack>
            </RadioGroup>
            <Text mt="2">Default mode is {hedgeMode === 'false' ? 'One Way' : 'Hedge Mode'}.</Text>
          </FormControl>

          {/* Single Asset / Multi Asset Mode */}
          <FormControl mt="4">
            <FormLabel>Single Asset / Multi Asset Mode</FormLabel>
            <RadioGroup onChange={(value) => setSettings({ ...settings, assetMode: value })} value={assetMode}>
              <Stack direction="row">
                <Radio value="false">Single Asset Mode (SAM)</Radio>
                <Radio value="true">Multi Asset Mode (MAM)</Radio>
              </Stack>
            </RadioGroup>
            <Text mt="2">Default is Single Asset Mode (SAM).</Text>
          </FormControl>

          {/* Stick Settings Button */}
          <FormControl mt="6">
            <Checkbox 
                isChecked={stickSettings} 
                onChange={(e) => setSettings({ ...settings, stickSettings: e.target.checked })}>
                Stick Settings
            </Checkbox>
            <Text mt="2">
                The bot ensures these settings are applied before any trade execution.
            </Text>
            </FormControl>

       
            <Button colorScheme="teal" onClick={handleSave}>   
              Save Settings
            </Button>
          </Box>
  );
};

export default GeneralExchangeSettingsModal;
