import React, { useState, useCallback, useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  useToast,
  Button,
  Box,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import apiService from 'services/api';

const CreateStrategyModal = React.memo(() => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [newStrategyName, setNewStrategyName] = useState({
    name: '',
    hookkey: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tradingViewLink = useMemo(
    () => apiService.getTradingViewWebhookUrl(),
    []
  );

  const handleNameChange = useCallback((e) => {
    setNewStrategyName((prev) => ({ ...prev, name: e.target.value }));
  }, []);

  const handleHookKeyChange = useCallback((e) => {
    setNewStrategyName((prev) => ({ ...prev, hookkey: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!newStrategyName.name || !newStrategyName.hookkey) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.createStrategy({
        name: newStrategyName.name,
        hookkey: newStrategyName.hookkey,
      });

      toast({
        title: 'Strategy created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/admin/default');
    } catch (error) {
      toast({
        title: 'Error creating strategy',
        description: error.message || 'Please verify the inputs and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [newStrategyName, navigate, toast]);
  
  return (
    <Box mt={20}>
      <FormControl isRequired>
        <FormLabel>Strategy Name</FormLabel>
        <Input
          value={newStrategyName.name}
          onChange={handleNameChange}
          placeholder="Enter strategy name"
        />
      </FormControl>

      <FormControl isRequired mt={4}>
        <FormLabel>Webhook Key</FormLabel>
        <Input
          value={newStrategyName.hookkey}
          onChange={handleHookKeyChange}
          placeholder="Enter webhook key"
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>TradingView Link</FormLabel>
        <Input value={tradingViewLink} isReadOnly />
      </FormControl>

      <Button
        mt={5}
        colorScheme="teal"
        onClick={handleSubmit}
        isLoading={isSubmitting}
        loadingText="Creating..."
      >
        Create Strategy
      </Button>
    </Box>
  );
});

export default CreateStrategyModal;
