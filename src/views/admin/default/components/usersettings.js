import React, { useState, useEffect } from 'react';
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
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Checkbox,
  Text,
  RadioGroup,
  Radio,
  Stack
} from '@chakra-ui/react'; // Assuming you're using Chakra UI

const GeneralExchangeSettingsModal = ({ isOpen, onClose, balance, userid }) => {
  
  const [settings, setSettings] = useState({});
  
  const [originalsettings, setOriginalSettings] = useState(null);

  const {  leverage, stickSettings, hedgeMode, assetMode } = settings;

  const fetchSettings = async (useridset) => {
    if(useridset){
      try {        
        const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users/${useridset}/settings`);
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
  };

  useEffect(() => {
    fetchSettings(userid);
  }, [userid]);

  const handleSave = async () => {

    const updatedFields = {};

    console.log("COMPARE",settings, originalsettings);

    Object.keys(settings).forEach((key) => {
      if (settings[key] !== originalsettings[key]) {
        updatedFields[key] = settings[key];
      }
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/users/${userid}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error('Settings save failed');
      }

      const data = await response.json();
      console.log('Settings save successful:', data);
      // Reset modal state after success
      onClose();
    } catch (error) {
      console.error('Settings error:', error);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>General Exchange Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Futures Account Type */}
          <FormControl mt="4">
            <FormLabel>Futures Account Type</FormLabel>
            <Text>Default: USD-M futures</Text>
          </FormControl>

          {/* User Account Balance */}
          <FormControl mt="4">
            <FormLabel>User Account Balance</FormLabel>
            <Text>Available balance in Futures Account (USDT): {balance?.balance.availableBalance || 0} USDT</Text>
          </FormControl>

          {/* Leverage Settings */}
          <FormControl mt="4">
            <FormLabel>Leverage Settings</FormLabel>
            <Text>Current Leverage: {leverage}x</Text>
            
            {/* Leverage Slider */}
            <Slider 
                value={leverage} 
                onChange={(val) => setSettings({ ...settings, leverage: val })} 
                min={1} 
                max={50} 
                step={1}
            >
                {/* Checkpoints at 10x, 25x, 30x */}
                <SliderMark value={10} mt="1" ml="-2.5" fontSize="sm">
                10x
                </SliderMark>
                <SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
                25x
                </SliderMark>
                <SliderMark value={30} mt="1" ml="-2.5" fontSize="sm">
                30x
                </SliderMark>

                <SliderTrack>
                <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6} />
            </Slider>
            
            <Text mt="2">Default leverage is {leverage}x.</Text>
            </FormControl>


          {/* Hedge Mode / One Way Mode */}
          <FormControl mt="4">
            <FormLabel>Hedge Mode/One Way Mode</FormLabel>
            <RadioGroup onChange={(value) => setSettings({ ...settings, hedgeMode: value })} value={hedgeMode}>
              <Stack direction="row">
                <Radio value="false">One Way</Radio>
                <Radio value="true">Hedge Mode</Radio>
              </Stack>
            </RadioGroup>
            <Text mt="2">Default mode is {hedgeMode === 'false' ? 'One Way' : 'Hedge Mode'}.</Text>
          </FormControl>

          {/* Cross/Isolated Mode */}
          {/* <FormControl mt="4">
            <FormLabel>Cross/Isolated Mode</FormLabel>
            <RadioGroup onChange={(value) => setSettings({ ...settings, marginMode: value })} value={marginMode}>
              <Stack direction="row">
                <Radio value="cross">Cross</Radio>
                <Radio value="isolated">Isolated</Radio>
              </Stack>
            </RadioGroup>
          </FormControl> */}

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

        </ModalBody>
        <ModalFooter>
            <Button colorScheme="teal" onClick={handleSave}>   
              Save Settings
            </Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GeneralExchangeSettingsModal;