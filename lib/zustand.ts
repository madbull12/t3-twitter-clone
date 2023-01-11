import create from "zustand";
import { LikesWithPayloads, UserWithPayloads } from "../interface";

interface Preview {
  preview: string;
  setPreview: (objectUrl: string) => void;
}

interface Modal {
  modal: boolean;
  setModal: (value: boolean) => void;
}

interface TweetIdStore {
  tweetId:string;
  setTweetId:(value:string) => void;
}

interface Drawer {
  drawer: boolean;
  setDrawer: (value: boolean) => void;
}

interface UserLikes {
  likes:LikesWithPayloads[] | null;
  setLikes:(value:LikesWithPayloads[]) => void
}

export const usePreviewStore = create<Preview>((set) => ({
  preview: "",
  setPreview: (objectUrl: string) => set(() => ({ preview: objectUrl })),
}));

export const useReplyModal = create<Modal>((set) => ({
  modal: false,
  setModal: (value: boolean) => set(() => ({ modal: value })),
}));
export const useLoginModal = create<Modal>((set) => ({
  modal: false,
  setModal: (value: boolean) => set(() => ({ modal: value })),
}));
export const useCreateModal = create<Modal>((set) => ({
  modal: false,
  setModal: (value: boolean) => set(() => ({ modal: value })),
}));

export const useTweetId = create<TweetIdStore>((set)=>({
  tweetId:"",
  setTweetId:(value:string)=>set(()=>({ tweetId:value }))
}))

export const useEditProfileModal = create<Modal>((set)=>({
  modal:false,
  setModal:(value:boolean)=>set(()=>({ modal:value }))
}));

export const useDisplayModal = create<Modal>((set)=>({
  modal:false,
  setModal:(value:boolean)=>set(()=>({ modal:value }))
}))
export const useLikesModal = create<Modal>((set)=>({
  modal:false,
  setModal:(value:boolean)=>set(()=>({ modal:value }))
}))

export const useUserLikes = create<UserLikes>((set)=>({
  likes:null,
  setLikes:(value:LikesWithPayloads[])=>set(()=>({ likes:value }))
}))

export const useMobileDrawer = create<Drawer>((set)=>({
  drawer:false,
  setDrawer:(value:boolean)=>set(()=>({ drawer:value }))
}))