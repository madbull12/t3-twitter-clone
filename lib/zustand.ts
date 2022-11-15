import  create  from 'zustand'

interface Preview {
    preview:string;
    setPreview:(objectUrl:string)=>void
}

export const usePreviewStore = create<Preview>((set)=>({
    preview:"",
    setPreview:(objectUrl:string)=>set(()=>({ preview:objectUrl }))
}));