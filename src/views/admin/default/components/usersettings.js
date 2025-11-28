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
  Stack,
} from '@chakra-ui/react';
import apiService from 'services/api';

const GeneralExchangeSettingsModal = React.memo(({ userid }) => {
  const [settings, setSettings] = useState({});
  const [balance, setBalance] = useState({});
  const [originalsettings, setOriginalSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toast = useToast();

  const fetchSettings = useCallback(async (useridset) => {
    if (!useridset) return;

    try {
      const data = await apiService.getUserSettings(useridset);
      setSettings(data.settings);
      setOriginalSettings(data.settings);
    } catch (err) {
      console.error('Error fetching settings:', err);
      toast({
        title: 'Error loading settings',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings(userid);
  }, [fetchSettings, userid]);

  const handleSave = useCallback(async () => {
    const updatedFields = {};

    if (originalsettings) {
      Object.keys(settings).forEach((key) => {
        if (settings[key] !== originalsettings[key]) {
          updatedFields[key] = settings[key];
        }
      });
    } else {
      Object.assign(updatedFields, settings);
    }

    if (Object.keys(updatedFields).length === 0) {
      toast({
        title: 'No changes to save',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSaving(true);

    try {
      await apiService.updateUserSettings(userid, updatedFields);

      toast({
        title: 'Settings saved successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setOriginalSettings(settings);
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  }, [settings, originalsettings, userid, toast]);

  const fetchAccountinfo = useCallback(
    async (accuserid, assetpass = 'USDT') => {
      setIsRefreshing(true);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKENDAPI}/api/binance/account-info/${accuserid}/${assetpass}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message?.msg || 'Failed to fetch balance');
        }

        const data = await response.json();
        setBalance(data);

        toast({
          title: 'Balance refreshed',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: 'Error fetching balance',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsRefreshing(false);
      }
    },
    [toast]
  );


  const handleRadioChange = useCallback((field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCheckboxChange = useCallback((e) => {
    setSettings((prev) => ({ ...prev, stickSettings: e.target.checked }));
  }, []);

  return (
    <Box mt="4" bg="gray.50" p="4" borderRadius="md">
      <Text fontWeight="bold" mb={4}>
        General Exchange Settings
      </Text>

      <FormControl mt="4">
        <FormLabel>Futures Account Type</FormLabel>
        <Text>Default: USD-M futures</Text>
      </FormControl>

      <FormControl
        mt="4"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <FormLabel>User Account Balance</FormLabel>
        <Text>{balance?.balance?.availableBalance || 0} USDT</Text>
        <Button
          onClick={() => fetchAccountinfo(userid)}
          size="sm"
          ml="2"
          isLoading={isRefreshing}
          loadingText="Refreshing..."
        >
          Refresh
        </Button>
      </FormControl>

      <FormControl mt="4">
        <FormLabel>Hedge Mode/One Way Mode</FormLabel>
        <RadioGroup
          onChange={(value) => handleRadioChange('hedgeMode', value)}
          value={settings.hedgeMode?.toString()}
        >
          <Stack direction="row">
            <Radio value="false">One Way</Radio>
            <Radio value="true">Hedge Mode</Radio>
          </Stack>
        </RadioGroup>
        <Text mt="2">
          Default mode is{' '}
          {!settings.hedgeMode ? 'One Way Mode' : 'Hedge Mode'}.
        </Text>
      </FormControl>

      <FormControl mt="4">
        <FormLabel>Single Asset / Multi Asset Mode</FormLabel>
        <RadioGroup
          onChange={(value) => handleRadioChange('assetMode', value)}
          value={settings.assetMode?.toString()}
        >
          <Stack direction="row">
            <Radio value="false">Single Asset Mode (SAM)</Radio>
            <Radio value="true">Multi Asset Mode (MAM)</Radio>
          </Stack>
        </RadioGroup>
        <Text mt="2">
          Default is{' '}
          {!settings?.assetMode
            ? 'Single Asset Mode (SAM)'
            : 'Multi Asset Mode (MAM)'}
          .
        </Text>
      </FormControl>

      <FormControl mt="6">
        <Checkbox
          isChecked={settings.stickSettings}
          onChange={handleCheckboxChange}
        >
          Stick Settings
        </Checkbox>
        <Text mt="2">
          The bot ensures these settings are applied before any trade execution.
        </Text>
      </FormControl>

      <Button
        colorScheme="teal"
        onClick={handleSave}
        mt={4}
        isLoading={isSaving}
        loadingText="Saving..."
      >
        Save Settings
      </Button>
    </Box>
  );
});

export default GeneralExchangeSettingsModal;
