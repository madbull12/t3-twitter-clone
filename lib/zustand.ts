import { Bookmark } from "@prisma/client";
import create from "zustand";
import {
  BookmarksWithPayloads,
  LikesWithPayloads,
  RetweetsWithPayloads,
  TweetWithUser,
  UserWithPayloads,
} from "../interface";

interface Preview {
  preview: string;
  setPreview: (objectUrl: string) => void;
}

interface Modal {
  modal: boolean;
  setModal: (value: boolean) => void;
}
interface PollingIsOpen {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

interface TweetIdStore {
  tweetId: string;
  setTweetId: (value: string) => void;
}

interface Drawer {
  drawer: boolean;
  setDrawer: (value: boolean) => void;
}

interface UserLikes {
  likes: LikesWithPayloads[] | null;
  setLikes: (value: LikesWithPayloads[]) => void;
}
interface UserRetweets {
  retweets: TweetWithUser[] | null;
  setRetweets: (value: TweetWithUser[]) => void;
}

interface UserBookmarks {
  bookmark: string;
  setBookmark: (value: string) => void;
}
interface Name {
  name: string;
  setName: (value: string) => void;
}

interface DisableTweet {
  isDisabled: boolean;
  setIsDisabled: (value: boolean) => void;
}

interface ChoiceState {
  choices: Choice[];
  incChoices: () => void;
  setChoices:(value:Choice[]) => void
}

interface Choice {
  choice:string;
}

interface PhotoView {
  src:string;
  setSrc:(value:string)=>void
  size:"medium" | "large",
  setSize:(value:"medium"|"large")=>void

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

export const useTweetId = create<TweetIdStore>((set) => ({
  tweetId: "",
  setTweetId: (value: string) => set(() => ({ tweetId: value })),
}));

export const useEditProfileModal = create<Modal>((set) => ({
  modal: false,
  setModal: (value: boolean) => set(() => ({ modal: value })),
}));

export const useDisplayModal = create<Modal>((set) => ({
  modal: false,
  setModal: (value: boolean) => set(() => ({ modal: value })),
}));
export const useLikesModal = create<Modal>((set) => ({
  modal: false,
  setModal: (value: boolean) => set(() => ({ modal: value })),
}));
export const useHandleModal = create<Modal>((set) => ({
  modal: false,
  setModal: (value: boolean) => set(() => ({ modal: value })),
}));
export const useRetweetsModal = create<Modal>((set) => ({
  modal: false,
  setModal: (value: boolean) => set(() => ({ modal: value })),
}));

export const useUserLikes = create<UserLikes>((set) => ({
  likes: null,
  setLikes: (value: LikesWithPayloads[]) => set(() => ({ likes: value })),
}));
export const useUserRetweets = create<UserRetweets>((set) => ({
  retweets: null,
  setRetweets: (value: TweetWithUser[]) => set(() => ({ retweets: value })),
}));

export const useMobileDrawer = create<Drawer>((set) => ({
  drawer: false,
  setDrawer: (value: boolean) => set(() => ({ drawer: value })),
}));

export const useCreateListModal = create<Modal>((set) => ({
  modal: false,
  setModal: (value: boolean) => set(() => ({ modal: value })),
}));
export const useEditListModal = create<Modal>((set) => ({
  modal: false,
  setModal: (value: boolean) => set(() => ({ modal: value })),
}));
export const useManageModal = create<Modal>((set) => ({
  modal: false,
  setModal: (value: boolean) => set(() => ({ modal: value })),
}));

export const usePhotoViewModal = create<Modal>((set)=>({
  modal:false,
  setModal:(value:boolean)=>set(()=>({ modal:value }))
}))

export const useOpenPolling = create<PollingIsOpen>((set) => ({
  isOpen: false,
  setIsOpen: (value: boolean) => set(() => ({ isOpen: value })),
}));
export const useDisableTweet = create<DisableTweet>((set) => ({
  isDisabled: false,
  setIsDisabled: (value: boolean) => set(() => ({ isDisabled: value })),
}));

export const useDebouncedBookmarks = create<UserBookmarks>((set) => ({
  bookmark: "",
  setBookmark: (value: string) => set(() => ({ bookmark: value })),
}));
export const useDebouncedPeople = create<Name>((set) => ({
  name: "",
  setName: (value: string) => set(() => ({ name: value })),
}));

export const usePhotoView = create<PhotoView>((set)=>({
  src:"",
  setSrc:(value:string)=>set(()=>({ src:value })),
  size:"medium",
  setSize:(value:"medium"|"large")=>set(()=>({ size:value }))
}))

export const useChoices = create<ChoiceState>((set) => ({
  choices: [
    {
      choice: "",
    },
    {
      choice: "",
    },
  ],
  incChoices: () =>
    set((state) => ({ choices: [...state.choices, { choice: "" }] })),
  
  setChoices:(value:Choice[])=>set(()=>({ choices:value }))
}));
