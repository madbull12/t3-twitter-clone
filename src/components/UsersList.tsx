import React from "react";
import { v4 } from "uuid";
import { UserWithPayloads } from "../../interface";
import PeopleComponent from "./PeopleComponent";

const UsersList = ({ users }: { users: UserWithPayloads[] }) => {
  return (
    <div>
      {users.map((user) => (
        <PeopleComponent key={v4()} user={user as UserWithPayloads} />
      ))}
    </div>
  );
};

export default UsersList;
