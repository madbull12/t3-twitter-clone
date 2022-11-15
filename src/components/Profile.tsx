import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

const Profile = () => {
  const { data: session } = useSession();
  return (
    <div className="mt-4 flex items-center gap-x-2">
      <Image
        alt="profile"
        src={session?.user?.image ?? ""}
        height={40}
        width={40}
        className="rounded-full"
      />
      <p className="font-semibold">{session?.user?.name}</p>
    </div>
  );
};

export default Profile;
