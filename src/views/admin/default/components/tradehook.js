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
    
          if (data.data.msg && Object.keys(data.data.msg).length > 0 && Object.values(data.data.msg).some((messages) => messages.length > 0)) {
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
