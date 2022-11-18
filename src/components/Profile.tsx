import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import Avatar from "./Avatar";

const Profile = () => {
  const { data: session } = useSession();
  return (
    <div className="mt-4 flex items-center gap-x-2">
      <Avatar image={session?.user?.image || ""} />
      <p className="font-semibold">{session?.user?.name}</p>
    </div>
  );
};

export default Profile;
