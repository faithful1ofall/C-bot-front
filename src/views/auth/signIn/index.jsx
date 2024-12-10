/* eslint-disable */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Chakra imports
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
  useToast, // Import useToast
} from "@chakra-ui/react";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const toast = useToast(); // Initialize toast
  
  const jwttoken = localStorage.getItem('jwtToken');

  useEffect(() => {
    const isTokenExpired = (token) => {
      const base64Url = token.split('.')[1]; // Get payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );

      const decoded = JSON.parse(jsonPayload);
      const currentTime = Date.now() / 1000;

      console.log('decoded', decoded.exp, currentTime);
      return decoded.exp <= currentTime;
    };

    if (!isTokenExpired(jwttoken)) {
      navigate('/admin/default');
      console.log('Token already exists');
    }
    
  }, [jwttoken, navigate]);

  const handleSignin = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/admin/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }), // Pass the password state
      });

      const data = await response.json();
      const token = data.token; // Assume the JWT is in the 'token' field

      

      if (response.ok) {
        console.log('Signed in successfully', data);
        
        // Save the JWT in local storage
        localStorage.setItem("jwtToken", token);
        toast({
          title: "Sign-in successful.",
          description: "You have been signed in successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/admin/default");
      } else {
        setLoading(false);
        console.error('Error signing in', data);
        toast({
          title: "Sign-in failed.",
          description: data.error || "An error occurred while signing in.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Request failed', error);
      toast({
        title: "Request failed.",
        description: "Unable to sign in. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

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
