import React from "react";

interface IProps {
  text: string;
  handleClick?:()=>void;
  disabled?:boolean;
}
const Button = ({ text,handleClick,disabled }: IProps) => {
  return (
    <button onClick={handleClick} disabled={disabled} className={`w-full rounded-full ${disabled ? "bg-blue-400" : "bg-primary"} px-2 py-1  md:px-4 md:py-2 font-semibold text-white`}>
      {text}
    </button>
  );
};

export default Button;
