// src/components/UserList.js

import { SimpleGrid } from "@chakra-ui/react";
import UserCard from "./UserCard";

const UserList = ({ users, strategies, handleUserActions }) => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="20px" mt="40px">
    {users.map((user) => (
      <UserCard key={user._id} user={user} strategies={strategies} handleUserActions={handleUserActions} />
    ))}
  </SimpleGrid>
);

export default UserList;