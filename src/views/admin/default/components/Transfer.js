import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';


const TransferModal = ({ isOpen, onClose, userid }) => {
  const [transferDirection, setTransferDirection] = useState("MAIN_UMFUTURE"); // Default direction
  const [transferAmount, setTransferAmount] = useState(0);
  const [loading, setLoading] = useState({ refresh: false, transfer: false });
  const [asset, setAsset] = useState('USDT');
  const [balance, setBalance] = useState({});
  const toast = useToast();
  const jwttoken = localStorage.getItem("jwtToken");

  const handleTransfer = async (user, assetused) => {
    setLoading((prev) => ({ ...prev, transfer: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/binance/user-universal-transfer/${user}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwttoken}`,
        },
        body: JSON.stringify({
            transfertype: transferDirection,
            asset: assetused,
            amount: transferAmount,
        }),
      });

      /* if (!response.ok) {
        throw new Error('Transfer failed');
      } */

      const data = await response.json();
      // Show success toast popup
      
      if (data.success){
      toast({
        title: 'Internal Transfer Successful',
        description: `You have successfully transferred ${transferAmount} ${asset}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      console.log('Transfer successful:', data);
        
    //  await fetchAccountinfo(userid);
      // Reset modal state after success
      setTransferAmount(0);
      setLoading((prev) => ({ ...prev, transfer: false }));
      } else {

        toast({
        title: 'Internal Transfer Error',
        description: `${data.message.msg || data.message}.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading((prev) => ({ ...prev, transfer: false }));
      }
        
    } catch (error) {
      setLoading((prev) => ({ ...prev, transfer: false }));
      console.error('Transfer error:', error);
    }
  };

  const fetchAccountinfo = async (accuserid, assetpass) => {
    setLoading((prev) => ({ ...prev, refresh: true }));
    const assetfind = assetpass || 'USDT';

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/binance/account-info/${accuserid}/${assetfind}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwttoken}`,
          },
        },
      );
      if (!response.ok) {
        const error = await response.json();
        toast({
        title: 'Balance Refresh Error',
        description: `${error.message.msg || error.message}.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
        setLoading((prev) => ({ ...prev, refresh: false }));
        
        return error.message.msg;
        }
      const data = await response.json(); // Parse the JSON response
      setBalance(data);
      setLoading((prev) => ({ ...prev, refresh: false }));
    } catch (err) {
toast({
        title: 'Balance Refresh Error',
        description: `${err.message.msg || err.message}.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error(err.message);
      setLoading((prev) => ({ ...prev, refresh: false }));
      
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Internal Transfer Between Spot and Futures</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Internal Transfer Direction</FormLabel>
            <Select
              value={transferDirection}
              onChange={(e) => setTransferDirection(e.target.value)}
            >
              <option value="MAIN_UMFUTURE">Spot to USDⓈ-M Futures</option>
              <option value="UMFUTURE_MAIN">USDⓈ-M Futures to Spot</option>
              <option value="MAIN_FUNDING">Spot to Funding</option>
              <option value="FUNDING_MAIN">Funding to Spot</option>
              <option value="FUNDING_UMFUTURE">Funding to USDⓈ-M Futures</option>
              <option value="UMFUTURE_FUNDING">USDⓈ-M Futures to Funding</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Asset</FormLabel>
                <Select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                >
                <option value="USDT">USDT</option>
                <option value="BUSD">USDC</option>
                </Select>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Transfer Amount</FormLabel>
            <Input
              placeholder="Enter amount"
              type="number"
              value={transferAmount || ""}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
          </FormControl>

          <Text mt={4}>
            Futures Available Balance (USD): {balance?.balance?.availableBalance || 0}
          </Text>
          <Text mt={4}>
            Spot Available Balance (USD): {balance?.balance?.spotavailableBalance || 0}
          </Text>
          <Text mt={4}>
            Funding Available Balance (USD): {balance?.balance?.fundingBalance || 0}
          </Text>
          <Button colorScheme="blue" mr={3} onClick={() => fetchAccountinfo(userid, asset)} isLoading={loading.refresh}>
            Refresh
          </Button>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => handleTransfer(userid, asset)} isLoading={loading.transfer}>
            Confirm Transfer
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransferModal;
