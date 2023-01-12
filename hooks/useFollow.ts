import { toast } from "react-hot-toast";
import { trpc } from "../src/utils/trpc";
import { useState } from 'react'
const useFollow = (userId:string) => {
    const { mutateAsync:followUser } = trpc.follow.followUser.useMutation() 
    const { mutateAsync:unfollowUser } = trpc.follow.unfollowUser.useMutation();
    const { data:alreadyFollowed } = trpc.follow.getSingleFollower.useQuery({ followingId:userId as string });
    const [followed,setFollowed] = useState<boolean>();

    const handleFollow = async() => {
        setFollowed(true)
        await toast.promise(followUser({ followingId:userId }),{
            success:"Following user",
            loading:"Loading...",
            error:(err)=>`Oops something went wrong ` + err
        })
    }
    const handleUnfollow = async() => {
        setFollowed(false)
        await toast.promise(unfollowUser({ followingId:userId }),{
            success:"User unfollowed",
            loading:"Unfollowing user",
            error:(err)=>`Oops something went wrong ` + err
        })
    }
    

    return { handleFollow,handleUnfollow,followed,alreadyFollowed }



}

export default useFollow;