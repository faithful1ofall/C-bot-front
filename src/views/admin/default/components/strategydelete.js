import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useToast } from '@chakra-ui/react';

const StrategyDeleteConfirmationModal = React.memo(({ isOpen, onClose, jwttoken, todelete, strategyname }) => {
    const toast = useToast();

    const deleteStrategy = async (id) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKENDAPI}/api/strategies/${id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${jwttoken}`,
              },
            },
          );
          if (response.ok) {
            toast({
              title: 'Strategy deleted successfully.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            onClose();
           // fetchStrategies();
            // fetchUsers();
          } else {
            toast({
              title: 'Error deleting strategy.',
              description: 'Please try again later.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            console.error('Failed to delete strategy');
          }
        } catch (error) {
          toast({
            title: 'Error deleting strategy.',
            description: 'Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          console.error('Error deleting strategy:', error);
        }
      };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Strategy Delete Confirmation</ModalHeader>
        <ModalCloseButton />
        ModalBody>
      Are you sure you want to delete the strategy{' '}
      <Text as="span" fontWeight="bold" color="red.500">
        {strategyname}
      </Text>
      ? This action cannot be undone.
    </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={() => deleteStrategy(todelete)}
            ml={3}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default StrategyDeleteConfirmationModal;
