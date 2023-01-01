import Image from "next/legacy/image";
import React from "react";

interface IProps {
  image: string;
  height:number;
  width:number;
}
const Avatar = ({ image,height,width }: IProps) => {
  return (
    // <div className="relative w-[25px] h-[25px]  md:w-[50px] md:h-[50px]">
      
      <Image
        alt="profile-image"
        className="rounded-full"
        src={image}
        width={width}
        height={height}
        objectFit="cover"
      />
    // {/* </div> */}
  );
};

export default Avatar;
