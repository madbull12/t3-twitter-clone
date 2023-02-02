import React from "react";
import Body from "../../../components/Body";
import NavFeed from "../../../components/NavFeed";
import { trpc } from "../../../utils/trpc";
import { MdPostAdd } from "react-icons/md";
import { useRouter } from "next/router";
import Loader from "../../../components/Loader";
import { useSession } from "next-auth/react";
import { useCreateListModal } from "../../../../lib/zustand";
import ListComponent from "../../../components/ListComponent";
import { ListWithPayloads } from "../../../../interface";
const ListPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: user } = trpc.user.getUser.useQuery({
    userId: userId as string,
  });
  const { data: userLists, isLoading } = trpc.list.getUserLists.useQuery({
    userId: userId as string,
  });
  const { data: session } = useSession();
  const { setModal } = useCreateListModal();
  return (
    <Body>
      <NavFeed
        title={"Lists"}
        subtitle={
          user ? `@${user?.handle ?? user?.name?.trim().toLowerCase()} ` : ""
        }
      >
        {session?.user?.id === userId ? (
          <div
            className="absolute top-6 right-4"
            onClick={() => setModal(true)}
          >
            <MdPostAdd className="cursor-pointer text-2xl " />
          </div>
        ) : null}
      </NavFeed>
      <div className="p-2">
        {user ? (
          <h1 className="p-2 text-2xl font-bold">
            {session?.user?.id === userId ? "Your" : `${user?.name}'s`} Lists
          </h1>
        ) : null}
        {!isLoading ? (
          <>
            {userLists?.length !== 0 ? (
              <div>
                {userLists?.map((list) => (
                  <ListComponent list={list as ListWithPayloads} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No lists</p>
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </Body>
  );
};

export default ListPage;
