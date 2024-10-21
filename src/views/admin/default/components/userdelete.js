import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useToast } from '@chakra-ui/react';

const UserDeleteConfirmationModal = React.memo(({ isOpen, onClose, jwttoken, useredit }) => {
    const toast = useToast();
    const deleteuser = async (id) => {
        console.log('user id', id);
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKENDAPI}/api/users/${id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${jwttoken}`, // Attach the token
              },
            },
          );
    
          if (response.ok) {
            toast({
              title: 'User deleted successfully.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
           // fetchUsers();
            onClose();
          } else {
            toast({
              title: 'Error deleting user.',
              description: 'Please try again later.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            console.error('Failed to delete User');
          }
        } catch (error) {
          toast({
            title: 'Error deleting user.',
            description: 'Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          console.error('Error deleting User:', error);
        }
      };
    
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User Delete Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this user? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={() => deleteuser(useredit)}
            ml={3}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default UserDeleteConfirmationModal;