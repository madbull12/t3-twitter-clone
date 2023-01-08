import React from "react";
import { useMediaQuery } from "usehooks-ts";

const Body = ({ children }: { children: React.ReactNode }) => {
  const phone = useMediaQuery("(min-width:768px)");
  return (
    <main className={`relative z-[999] ${phone ? "border-x border-base-300":null}   md:ml-20 min-h-[120vh]  bg-base-100    lg:max-w-3xl  xl:ml-80`}>
      {children}
    </main>
  );
};

export default Body;
