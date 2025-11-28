import React, { useState, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  Text,
} from '@chakra-ui/react';
import apiService from 'services/api';

const StrategyDeleteConfirmationModal = React.memo(
  ({ isOpen, onClose, todelete, strategyname }) => {
    const toast = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteStrategy = useCallback(async () => {
      setIsDeleting(true);
      
      try {
        await apiService.deleteStrategy(todelete);
        
        toast({
          title: 'Strategy deleted successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        onClose();
        window.location.reload();
      } catch (error) {
        toast({
          title: 'Error deleting strategy',
          description: error.message || 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsDeleting(false);
      }
    }, [todelete, onClose, toast]);

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Strategy Delete Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the strategy{' '}
            <Text as="span" fontWeight="bold" color="red.500">
              {strategyname}
            </Text>
            ? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose} isDisabled={isDeleting}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteStrategy}
              ml={3}
              isLoading={isDeleting}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

export default StrategyDeleteConfirmationModal;
