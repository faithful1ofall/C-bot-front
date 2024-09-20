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
} from '@chakra-ui/react';

const TransferModal = ({ isOpen, onClose, balance }) => {
  const [transferDirection, setTransferDirection] = useState('MAIN_UMFUTURE'); // Default direction
  const [transferAmount, setTransferAmount] = useState('');
  const [asset, setAsset] = useState('');

  const handleTransfer = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/binance/user-universal-transfer/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction: transferDirection,
          amount: transferAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Transfer failed');
      }

      const data = await response.json();
      console.log('Transfer successful:', data);
      // Reset modal state after success
      setTransferAmount('');
      setTransferDirection('spot-to-futures');
      onClose();
    } catch (error) {
      console.error('Transfer error:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transfer Between Spot and Futures</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Transfer Direction</FormLabel>
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
                <option value="BUSD">BUSD</option>
                </Select>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Transfer Amount</FormLabel>
            <Input
              placeholder="Enter amount"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
          </FormControl>

          <Text mt={4}>
            Available Balance: {balance}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleTransfer}>
            Confirm Transfer
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransferModal;
