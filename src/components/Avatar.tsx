import Image from "next/legacy/image";
import React from "react";

interface IProps {
  image: string;
}
const Avatar = ({ image }: IProps) => {
  return (
    <div className="relative w-[30px] h-[30px] md:w-[50px] md:h-[50px]">
      
      <Image
        alt="profile-image"
        className="rounded-full"
        src={image}
        layout="fill"
      />
    </div>
  );
};

export default Avatar;
