import React from "react";
import { useMediaQuery } from "usehooks-ts";

const Body = ({ children }: { children: React.ReactNode }) => {
  const phone = useMediaQuery("(min-width:768px)");
  return (
    <main className={`relative overflow-clip z-[999] ${phone ? "border-x border-base-300":null}   md:ml-20 min-h-[200vh]  bg-base-100    lg:max-w-2xl  xl:ml-80`}>
      {children}
    </main>
  );
};

export default Body;
