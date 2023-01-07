import React from "react";

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative z-[999]  md:ml-20 min-h-[120vh]  bg-base-100  border-r border-base-300  lg:max-w-3xl  xl:ml-80 ">
      {children}
    </main>
  );
};

export default Body;
