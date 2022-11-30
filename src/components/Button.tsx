import React from "react";

interface IProps {
  text: string;
  handleClick?:()=>void
}
const Button = ({ text,handleClick }: IProps) => {
  return (
    <button onClick={handleClick} className="w-full rounded-full bg-primary  px-4 py-2 font-semibold text-white">
      {text}
    </button>
  );
};

export default Button;
