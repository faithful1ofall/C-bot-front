import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Select,
  Button,
  Text,
  RadioGroup,
  Radio,
  Stack
} from '@chakra-ui/react'; // Assuming you're using Chakra UI

const GeneralExchangeSettingsModal = ({ isOpen, onClose, settings, setSettings, handleStickSettings }) => {
  const { selectedTradingPair, futuresBalance, minBalance, maxBalance, leverage, hedgeMode, marginMode, assetMode, tradingPairs } = settings;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>General Exchange Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Futures Account Type */}
          <FormControl mt="4">
            <FormLabel>Futures Account Type</FormLabel>
            <Text>Default: USD-M futures</Text>
          </FormControl>

          {/* Trading Pair Selection */}
          <FormControl mt="4">
            <FormLabel>Select Trading Pair</FormLabel>
            <Select value={selectedTradingPair} onChange={(e) => setSettings({ ...settings, selectedTradingPair: e.target.value })}>
              {tradingPairs.map((pair) => (
                <option key={pair} value={pair}>
                  {pair}
                </option>
              ))}
            </Select>
            <Text mt="2">Default trading pair is set in bot settings.</Text>
          </FormControl>

          {/* User Account Balance */}
          <FormControl mt="4">
            <FormLabel>User Account Balance</FormLabel>
            <Text>Available balance in Futures Account: {futuresBalance} USD</Text>
            <Text>Min/Max balance check: {minBalance} USD - {maxBalance} USD</Text>
            {futuresBalance < minBalance || futuresBalance > maxBalance ? (
              <Text color="red.500" mt="2">Balance is outside the defined range.</Text>
            ) : (
              <Text color="green.500" mt="2">Balance is within the defined range.</Text>
            )}
          </FormControl>

          {/* Leverage Settings */}
          <FormControl mt="4">
            <FormLabel>Leverage Settings</FormLabel>
            <Text>Current Leverage: {leverage}x</Text>
            <Select value={leverage} onChange={(e) => setSettings({ ...settings, leverage: e.target.value })}>
              {[5, 10, 20, 50, 100].map((lev) => (
                <option key={lev} value={lev}>
                  {lev}x
                </option>
              ))}
            </Select>
            <Text mt="2">Default leverage is {leverage}x.</Text>
          </FormControl>

          {/* Hedge Mode / One Way Mode */}
          <FormControl mt="4">
            <FormLabel>Hedge Mode/One Way Mode</FormLabel>
            <RadioGroup onChange={(value) => setSettings({ ...settings, hedgeMode: value })} value={hedgeMode}>
              <Stack direction="row">
                <Radio value="oneWay">One Way</Radio>
                <Radio value="hedge">Hedge Mode</Radio>
              </Stack>
            </RadioGroup>
            <Text mt="2">Default mode is {hedgeMode === 'oneWay' ? 'One Way' : 'Hedge Mode'}.</Text>
          </FormControl>

          {/* Cross/Isolated Mode */}
          <FormControl mt="4">
            <FormLabel>Cross/Isolated Mode</FormLabel>
            <RadioGroup onChange={(value) => setSettings({ ...settings, marginMode: value })} value={marginMode}>
              <Stack direction="row">
                <Radio value="cross">Cross</Radio>
                <Radio value="isolated">Isolated</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {/* Single Asset / Multi Asset Mode */}
          <FormControl mt="4">
            <FormLabel>Single Asset / Multi Asset Mode</FormLabel>
            <RadioGroup onChange={(value) => setSettings({ ...settings, assetMode: value })} value={assetMode}>
              <Stack direction="row">
                <Radio value="single">Single Asset Mode (SAM)</Radio>
                <Radio value="multi">Multi Asset Mode (MAM)</Radio>
              </Stack>
            </RadioGroup>
            <Text mt="2">Default is Single Asset Mode (SAM).</Text>
          </FormControl>

          {/* Stick Settings Button */}
          <FormControl mt="6">
            <Button colorScheme="green" onClick={handleStickSettings}>
              Stick Settings
            </Button>
            <Text mt="2">
              The bot ensures these settings are applied before any trade execution.
            </Text>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GeneralExchangeSettingsModal;