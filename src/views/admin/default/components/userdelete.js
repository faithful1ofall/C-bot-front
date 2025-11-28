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
} from '@chakra-ui/react';
import apiService from 'services/api';

const UserDeleteConfirmationModal = React.memo(
  ({ isOpen, onClose, useredit }) => {
    const toast = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteuser = useCallback(async () => {
      setIsDeleting(true);

      try {
        await apiService.deleteUser(useredit);

        toast({
          title: 'User deleted successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        onClose();
        window.location.reload();
      } catch (error) {
        toast({
          title: 'Error deleting user',
          description: error.message || 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsDeleting(false);
      }
    }, [useredit, onClose, toast]);
    
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Delete Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose} isDisabled={isDeleting}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteuser}
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

export default UserDeleteConfirmationModal;