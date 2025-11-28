import React, { useState, useEffect, useCallback } from 'react';
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import apiService from 'services/api';

const UserModal = React.memo(({ isOpen, onClose, useredit, fetchusers }) => {
  const toast = useToast();
  const [olduser, setOldUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    apiKey: '',
    apiSecret: '',
  });

  const handleEditUser = useCallback(
    async (editid) => {
      try {
        const data = await apiService.getUserById(editid);
        setOldUser(data);
        setNewUser(data);
        if (fetchusers) await fetchusers();
      } catch (error) {
        toast({
          title: 'Error fetching user details',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [toast, fetchusers]
  );

  useEffect(() => {
    if (useredit !== '') {
      handleEditUser(useredit);
    }
  }, [handleEditUser, useredit]);

  const handleChange = useCallback((field, value) => {
    setNewUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  const validateInputs = useCallback(() => {
    if (!/^[a-zA-Z0-9_]+$/.test(newUser.name)) {
      toast({
        title: 'Name Error',
        description:
          'User Name can only contain letters, numbers, and underscores.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (newUser.apiKey.length < 64) {
      toast({
        title: 'API-Key Error',
        description: 'API Key must be 64 alphanumeric characters.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (newUser.apiSecret.length < 64) {
      toast({
        title: 'API-Secret Error',
        description: 'API Secret must be at least 64 characters long.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    return true;
  }, [newUser, toast]);


  const handleAddUser = useCallback(async () => {
    if (!validateInputs()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!useredit) {
        await apiService.createUser(newUser);
        toast({
          title: 'User created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        const updatedFields = {};
        Object.keys(newUser).forEach((key) => {
          if (newUser[key] !== olduser[key]) {
            updatedFields[key] = newUser[key];
          }
        });

        await apiService.updateUser(useredit, updatedFields);
        toast({
          title: 'User details updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }

      if (fetchusers) await fetchusers();
      onClose();
    } catch (error) {
      toast({
        title: useredit ? 'Error updating user' : 'Failed to create user',
        description: error.message || 'Please check the input and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateInputs, useredit, newUser, olduser, toast, fetchusers, onClose]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{useredit ? 'Edit User' : 'Add User'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>User Name</FormLabel>
            <Input
              value={newUser.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>API Key</FormLabel>
            <Input
              value={newUser.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>API Secret</FormLabel>
            <Input
              value={newUser.apiSecret}
              onChange={(e) => handleChange('apiSecret', e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3} isDisabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleAddUser}
            isLoading={isSubmitting}
            loadingText={useredit ? 'Updating...' : 'Creating...'}
          >
            {useredit ? 'Update User' : 'Add User'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default UserModal;
