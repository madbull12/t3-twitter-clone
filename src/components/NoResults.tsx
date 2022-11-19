import { useRouter } from "next/router";
import React from "react";

const NoResults = () => {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">No results for "{router.query.q}"</h1>
    </div>
  );
};

export default NoResults;
