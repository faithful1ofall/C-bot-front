// src/components/UserCard.js

import { Box, Text, Flex, Avatar, Switch } from "@chakra-ui/react";
import UserMenu from "./UserMenu";

const UserCard = ({ user, strategies, handleUserActions }) => (
  <Box p="5" shadow="md" borderWidth="1px" borderRadius="md">
    <Flex align="center" justify="space-between">
      <Avatar src="https://bit.ly/dan-abramov" />
      <UserMenu user={user} strategies={strategies} handleUserActions={handleUserActions} />
    </Flex>
    <Switch isChecked={user?.active} onChange={() => handleUserActions.toggleActive(user.id, user.active)} colorScheme="teal" />
    <Box mt="4">
      <Text>User Name: {user?.name}</Text>
      <Text>Strategies: {user.strategyIds.map(id => strategies.find(s => s.id === id)?.name || 'None').join(', ')}</Text>
    </Box>
  </Box>
);

export default UserCard;