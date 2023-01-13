import { Ring } from "@uiball/loaders";
import React from "react";

const Loader = () => {
  return (
    <div className="md:pt-4 flex justify-center">
      <Ring size={40} lineWeight={5} speed={2} color="#1D9BF0" />
    </div>
  );
};

export default Loader;
