import React, { useState, useEffect, useCallback } from 'react';
import { useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';

const UserModal = React.memo(({ isOpen, onClose, jwttoken, useredit, fetchusers }) => {

    const toast = useToast();
    const [olduser, setOldUser] = useState(null);
    
    const [newUser, setNewUser] = useState({
        name: '',
        apiKey:'',
        apiSecret: ''
    });



    const handleEditUser = useCallback(async (editid) => {
      try {
        const response1 = await fetch(
          `${process.env.REACT_APP_BACKENDAPI}/api/users/${editid}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwttoken}`,
            },
          },
        );
  
        if (!response1.ok) {
          throw new Error(`HTTP error! status: ${response1.status}`);
        }
        const data1 = await response1.json();
        setOldUser(data1);
        setNewUser(data1);
        await fetchusers();
      } catch (error) {
        toast({
          title: 'Error fetching user details.',
          description: 'Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Request failed', error);
      }
    }, [jwttoken, toast, fetchusers]);

    useEffect(() => {
      if(useredit === '') {
        handleEditUser(useredit);
      }      
    }, [handleEditUser, useredit]);
  

    const handleChange = (field, value) => {
        console.log(value);
        setNewUser((prevState) => ({
          ...prevState,
          [field]: value, // dynamically updates the field
        }));
      };

    // Function to validate input
  const validateInputs = () => {
    let isValid = true;

    // Validate User Name
    if (!/^[a-zA-Z0-9_]+$/.test(newUser.name)) {
      toast({
        title: 'Name Error.',
        description: 'User Name can only contain letters, numbers, and underscores.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      isValid = false;
    }

    // Validate API Key (example: 32 alphanumeric characters)
    if (newUser.apiKey.length < 64) {
      toast({
        title: 'API-Key Error.',
        description: 'API Key must be 64 alphanumeric characters.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      isValid = false;
    }

    // Validate API Secret (example: at least 8 characters)
    if (newUser.apiSecret.length < 64) {
      toast({
        title: 'API-Secret Error.',
        description: 'API Secret must be at least 64 characters long.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      isValid = false;
    }

    return isValid;
  };


    const handleAddUser = async () => {
        
        if (validateInputs() && !useredit) {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_BACKENDAPI}/api/users`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${jwttoken}`,
                },
                body: JSON.stringify(newUser),
              },
            );
    
            const data = await response.json();
    
            toast({
              title: 'User created successfully.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
           // fetchUsers();
    
            onClose(); // Close modal or form
            console.log('User added successfully:', data);
          } catch (error) {
            toast({
              title: 'Failed to create user.',
              description: 'Please check the input and try again.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            console.error('Error:', error);
          }
        } else {
          const updatedFields = {};
    
           Object.keys(newUser).forEach((key) => {
            if (newUser[key] !== olduser[key]) {
              updatedFields[key] = newUser[key];
            }
          }); 
    
          try {
            const response = await fetch(
              `${process.env.REACT_APP_BACKENDAPI}/api/users/${useredit}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${jwttoken}`,
                },
                body: JSON.stringify(updatedFields),
              },
            );
    
            const data = await response.json();
    
            toast({
              title: 'User details updated successfully.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
           // fetchUsers();
    
          //  SetUserEdit(false);
            onClose(); // Close modal or form
            console.log('User added successfully:', data);
          } catch (error) {
            toast({
              title: 'Error updating user details.',
              description: 'Please try again.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            console.error('Error:', error);
          }
        }
      };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{useredit ? 'Edit User' : 'Add User'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>User Name</FormLabel>
            <Input value={newUser.name} onChange={(e) => handleChange('name', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>API Key</FormLabel>
            <Input value={newUser.apiKey} onChange={(e) => handleChange('apiKey', e.target.value)} />
   
          </FormControl>
          <FormControl mt="4" >
            <FormLabel>API Secret</FormLabel>
            <Input
              value={newUser.apiSecret}
              onChange={(e) => handleChange('apiSecret', e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleAddUser}>
            {useredit ? 'Edit User' : 'Add User'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default UserModal;