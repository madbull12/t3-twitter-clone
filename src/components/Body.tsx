import React from "react";

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative ml-14 xs:ml-20 min-h-screen  border-r border-base-300  lg:max-w-2xl  xl:ml-80 ">
      {children}
    </main>
  );
};

export default Body;
