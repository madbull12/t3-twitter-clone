import { UserWithPayloads } from "../../interface";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Avatar from "./Avatar";
import Button from "./Button";
import { useSession } from "next-auth/react";

interface IProps {
  user: UserWithPayloads;
}
const PeopleComponent = ({ user }: IProps) => {
  const { data: session } = useSession();
  return (
    <div className="flex items-start justify-between gap-x-4 p-2">
      <Avatar image={user.image || ""} width={40} height={40} />
      <div className="mr-auto">
        <Link
          className="text-lg font-semibold hover:underline"
          href={`/${user.id}/${user.name}`}
        >
          {user.name}
        </Link>
        <p>{user.profile?.bio}</p>
      </div>
      {session?.user?.id !== user.id ? (
        <div className="ml-auto">
          <Button text={"Follow"} />
        </div>
      ) : null}
    </div>
  );
};

export default PeopleComponent;
