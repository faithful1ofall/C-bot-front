import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import apiService from 'services/api';

function SignIn() {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const toast = useToast();

  const handleClick = useCallback(() => setShow((prev) => !prev), []);

  const handleSignin = useCallback(async () => {
    if (!password || password.length < 8) {
      toast({
        title: 'Invalid password',
        description: 'Password must be at least 8 characters.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const data = await apiService.adminSignIn(password);
      
      localStorage.setItem('jwtToken', data.token);
      
      toast({
        title: 'Sign-in successful',
        description: 'You have been signed in successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/admin/default');
    } catch (error) {
      toast({
        title: 'Sign-in failed',
        description: error.message || 'Unable to sign in. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [password, navigate, toast]);

  return (
    <Flex
      maxW="100%"
      w='100%'
      mx="auto"
      me='auto'
      h='100vh'
      alignItems='center'
      justifyContent='center'
      mb={{ base: "30px", md: "60px" }}
      px={{ base: "25px", md: "0px" }}
      mt={{ base: "40px", md: "14vh" }}
      flexDirection='column'>
      <Box me='auto'>
        <Heading color={textColor} fontSize='36px' mb='10px'>
          Sign In
        </Heading>
        <Text
          mb='36px'
          ms='4px'
          color={textColorSecondary}
          fontWeight='400'
          fontSize='md'>
          Enter the password to sign in!
        </Text>
      </Box>
      <Flex
        zIndex='2'
        direction='column'
        w={{ base: "100%", md: "420px" }}
        maxW='100%'
        background='transparent'
        borderRadius='15px'
        mx={{ base: "auto", lg: "unset" }}
        me='auto'
        mb={{ base: "20px", md: "auto" }}>
        <Flex align='center' mb='25px'>
        </Flex>
        <FormControl>
          <FormLabel
            ms='4px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            display='flex'>
            Password<Text color={brandStars}>*</Text>
          </FormLabel>
          <InputGroup size='md'>
            <Input
              isRequired={true}
              fontSize='sm'
              placeholder='Min. 8 characters'
              mb='24px'
              size='lg'
              type={show ? "text" : "password"}
              variant='auth'
              value={password} // Bind the input value to state
              onChange={(e) => setPassword(e.target.value)} // Update password state  
            />
            <InputRightElement display='flex' alignItems='center' mt='4px'>
              <Icon
                color={textColorSecondary}
                _hover={{ cursor: "pointer" }}
                as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={handleClick}
              />
            </InputRightElement>
          </InputGroup>
          <Flex justifyContent='space-between' align='center' mb='24px'>
          </Flex>
          <Button
            fontSize='sm'
            variant='brand'
            fontWeight='500'
            w='100%'
            h='50'
            mb='24px'
            isLoading={loading}
            onClick={handleSignin}>
            Sign In
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
}

export default SignIn;
