import React from "react";

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative container ml-20 lg:ml-80 min-h-screen max-w-2xl py-4 ">
        {children}
    </main>
  );
};

export default Body;
