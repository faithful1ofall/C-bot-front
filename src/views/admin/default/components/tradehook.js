import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Select, useToast } from '@chakra-ui/react';

const TradingHookTriggerModal = React.memo(({ isOpen, onClose, strategies }) => {
    const toast = useToast();

    const [selectedStrategy, setSelectedStrategy] = useState('');

    const tradinghook = async () => {
        const hooking = {
          strategy: selectedStrategy,
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
    
          // Fetch updated position data
         // await fetchPosition();
    
          toast({
            title: 'Trade hook successful.',
            description: `Trade executed successfully.`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Trading Hook Trigger</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Select Strategy</FormLabel>
            <Select
              placeholder="Select strategy"
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
            >
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
  );
});

export default TradingHookTriggerModal;