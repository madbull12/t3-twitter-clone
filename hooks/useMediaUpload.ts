import { useState, useEffect } from "react";

const useMediaUpload = () => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState<string>();
  let mediaUrl : any=null;

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "xap2a5k4");
    // formData.append("file", );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dem2vt6lj/${
        selectedFile.type === "video/mp4" ? "video" : "image"
      }/upload`,
      {
        method: "POST",
        body: formData,
      }
    ).then((res) => res.json());

    mediaUrl = res.secure_url;
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  return {
    mediaUrl: mediaUrl as string,
    preview,
    setPreview,
    setSelectedFile,
    selectedFile,
    onSelectFile,
    upload,
  };
};

export default useMediaUpload;
