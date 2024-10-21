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

const CreateStrategyModal = React.memo(({ 
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
        console.error('Request failed', error);
      }

     // setStrategies((prevStrategies) => [...prevStrategies, newStrategy]);
   //  fetchStrategies();

      console.log("newStrategy", newStrategy);

      onCreateStrategyClose();
  };
  
  return (
    <FormControl isRequired>
            <FormLabel>Strategy Name</FormLabel>
            <Input 
              value={newStrategyName.name} 
              onChange={handleNameChange} 
              placeholder="Enter strategy name" 
            />
          </FormControl>
    <Modal isOpen={isCreateStrategyOpen} onClose={onCreateStrategyClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Strategy</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <form>
          <FormControl isRequired>
            <FormLabel>Strategy Name</FormLabel>
            <Input 
              value={newStrategyName.name} 
              onChange={handleNameChange} 
              placeholder="Enter strategy name" 
            />
          </FormControl>

        <FormControl isRequired>
            <FormLabel>Webhook Key</FormLabel>
            <Input 
              value={newStrategyName.hookkey} 
              onChange={handleHookKeyChange} 
              placeholder="Enter webhook key" 
            />
       </FormControl>
        <FormControl>
            <FormLabel mb="4">TradingView Link</FormLabel>
            <Input 
              value={tradingViewLink} 
              isReadOnly 
              placeholder="Enter TradingView link" 
            />
          </FormControl>
        </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleSubmit}>
            Create Strategy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default CreateStrategyModal;
