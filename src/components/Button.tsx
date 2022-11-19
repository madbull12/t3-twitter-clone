import React from "react";

interface IProps {
  text: string;
}
const Button = ({ text }: IProps) => {
  return (
    <button className="w-full rounded-full bg-primary  px-4 py-2 font-semibold text-white">
      {text}
    </button>
  );
};

export default Button;
