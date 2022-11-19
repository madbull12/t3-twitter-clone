import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import Avatar from "./Avatar";
import Button from "./Button";

interface IProps {
  user: User;
}
const PeopleComponent = ({ user }: IProps) => {
  return (
    <div className="flex items-start justify-between gap-x-4 p-2">
      <Avatar image={user.image || ""} />
      <div>
        <h1 className="text-lg font-semibold">{user.name}</h1>
      </div>
      <div className="ml-auto">
        <Button text={"Follow"} />
      </div>
    </div>
  );
};

export default PeopleComponent;
