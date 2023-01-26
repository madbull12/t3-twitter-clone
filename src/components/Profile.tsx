import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { trpc } from "../utils/trpc";
import Avatar from "./Avatar";

const Profile = () => {
  const { data: session } = useSession();
  const { data: user } = trpc.user.getUser.useQuery({ userId:session?.user?.id as string});
  return (
    <div className="mt-4 flex  items-center gap-x-2">
      <Avatar image={session?.user?.image || ""} width={40} height={40} />
      <div>
        <p className="hidden font-semibold xl:block">{session?.user?.name}</p>
        <p className="hidden text-sm text-gray-500 xl:block">@{user?.handle}</p>
      </div>
    </div>
  );
};

export default Profile;
