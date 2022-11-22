import create from "zustand";

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

export const useTweetId = create<TweetIdStore>((set)=>({
  tweetId:"",
  setTweetId:(value:string)=>set(()=>({ tweetId:value }))
}))