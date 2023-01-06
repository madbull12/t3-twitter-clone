import React from "react";

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative ml-14 xs:ml-20 min-h-screen w-full bg-base-100  border-r border-base-300  lg:max-w-3xl  xl:ml-80 ">
      {children}
    </main>
  );
};

export default Body;
