import React from "react";

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative border-r border-gray-100  ml-20 xl:ml-80 min-h-screen max-w-full lg:max-w-xl xl:max-w-2xl py-4 ">
        {children}
    </main>
  );
};

export default Body;
