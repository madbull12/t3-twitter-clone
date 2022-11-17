import React from "react";

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative container ml-80 min-h-screen max-w-2xl border-x border-gray-100 p-4">
        {children}
    </main>
  );
};

export default Body;
