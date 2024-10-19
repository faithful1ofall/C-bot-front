import React from 'react';
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
  Button
} from '@chakra-ui/react';

const CreateStrategyModal = React.memo(({ 
  isCreateStrategyOpen, 
  onCreateStrategyClose, 
  newStrategyName, 
  hookkey, 
  tradingViewLink, 
  handleNameChange, 
  handleHookKeyChange, 
  handleSubmit 
}) => {
  return (
    <Modal isOpen={isCreateStrategyOpen} onClose={onCreateStrategyClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Strategy</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Strategy Name</FormLabel>
            <Input 
              value={newStrategyName} 
              onChange={handleNameChange} 
              placeholder="Enter strategy name" 
            />

            <FormLabel>Webhook Key</FormLabel>
            <Input 
              value={hookkey} 
              onChange={handleHookKeyChange} 
              placeholder="Enter webhook key" 
            />

            <FormLabel mb="4">TradingView Link</FormLabel>
            <Input 
              value={tradingViewLink} 
              isReadOnly 
              placeholder="Enter TradingView link" 
            />
          </FormControl>
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
