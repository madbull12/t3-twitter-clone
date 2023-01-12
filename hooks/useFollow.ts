import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";

const useFollow = (userId:string) => {
    const { mutateAsync:followUser } = trpc.follow.followUser.useMutation() 
    const handleFollow = async() => {
        await toast.promise(followUser({ followingId:userId }),{
            success:"Following user",
            loading:"Loading...",
            error:(err)=>`Oops something went wrong ` + err
        })
    }
    const handleUnfollow = async() => {
        await toast.promise(followUser({ followingId:userId }),{
            success:"Following user",
            loading:"Loading...",
            error:(err)=>`Oops something went wrong ` + err
        })
    }


}

export default useFollow;