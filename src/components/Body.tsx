import React from "react";

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative ml-14 xs:ml-20 min-h-[200vh] p-2  md:p-4 border-r border-gray-100  lg:max-w-2xl  xl:ml-80 ">
      {children}
    </main>
  );
};

export default Body;
