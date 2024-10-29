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
  const [transferAmount, setTransferAmount] = useState();
  const [asset, setAsset] = useState('USDT');
  const [balance, setBalance] = useState({});
  const toast = useToast();
  const jwttoken = localStorage.getItem("jwtToken");

  const handleTransfer = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/binance/user-universal-transfer/${userid}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwttoken}`,
        },
        body: JSON.stringify({
            transfertype: transferDirection,
            asset: asset,
            amount: transferAmount,
        }),
      });

      /* if (!response.ok) {
        throw new Error('Transfer failed');
      } */

      const data = await response.json();
      // Show success toast popup
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
      setTransferDirection('');
    } catch (error) {
      console.error('Transfer error:', error);
    }
  };

  const fetchAccountinfo = async (accuserid, assetpass) => {
    const assetfind = 'USDT' || assetpass;

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
        return error.message.msg;
      }
      const data = await response.json(); // Parse the JSON response
      setBalance(data);
      
    } catch (err) {
      console.error(err.message);
      
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
          <Button colorScheme="blue" mr={3} onClick={() => fetchAccountinfo(userid)}>
            Refresh
          </Button>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => handleTransfer}>
            Confirm Transfer
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransferModal;
