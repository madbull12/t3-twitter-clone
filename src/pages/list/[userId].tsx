import React from "react";
import Body from "../../components/Body";
import NavFeed from "../../components/NavFeed";
import { trpc } from "../../utils/trpc";
import { MdPostAdd } from "react-icons/md";
import { useRouter } from "next/router";
import Loader from "../../components/Loader";
import { useSession } from "next-auth/react";
const ListPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: user } = trpc.user.getUser.useQuery({
    userId: userId as string,
  });
  const { data: userLists, isLoading } = trpc.list.getUserLists.useQuery({
    userId: userId as string,
  });
  const { data:session } = useSession()
  console.log(userLists);
  return (
    <Body>
      <NavFeed
        title={"Lists"}
        subtitle={user ? `@${user?.handle ?? user?.name?.trim().toLowerCase()} ` : ""}
      >
        <div className="absolute top-6 right-4">
          <MdPostAdd className="cursor-pointer text-2xl " />
        </div>
      </NavFeed>
      <div className="p-2">
        {user ? (
        <h1 className="p-2 text-2xl font-bold">{session?.user?.id === userId ? "Your" : `${user?.name}'s`} Lists</h1>

        ):null}
        {!isLoading ? (
          <>{userLists?.length !== 0 ? <div></div> : <p className="text-gray-500">No lists</p>}</>
        ) : (
          <Loader />
        )}
      </div>
    </Body>
  );
};

export default ListPage;
