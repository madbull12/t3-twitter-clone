import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Avatar from "./Avatar";
import Button from "./Button";

interface IProps {
  user: User;
}
const PeopleComponent = ({ user }: IProps) => {
  return (
    <div className="flex items-start justify-between gap-x-4 p-2">
      <Avatar image={user.image || ""} width={40} height={40} />
      <div>
        <Link className="text-lg font-semibold hover:underline" href={`/${user.id}/${user.name}`}>{user.name}</Link>
      </div>
      <div className="ml-auto">
        <Button text={"Follow"} />
      </div>
    </div>
  );
};

export default PeopleComponent;
