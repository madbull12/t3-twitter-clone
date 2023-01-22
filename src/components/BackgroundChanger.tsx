import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const BackgroundChanger = () => {
  const [theme, setTheme] = useLocalStorage("theme", "default");
  const onThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value);
  };
  return (
    <div className="space-y-2 ">
      <p className="text-start text-xs font-semibold text-gray-400">
        Background
      </p>
      <div className="flex items-center rounded-3xl bg-base-300 px-4 py-2 md:h-20 ">
        <div className="flex flex-col items-center justify-between md:justify-center gap-y-4 gap-x-4 w-full md:flex-row md:w-1/2 mx-auto ">
          <button className="flex h-full w-full whitespace-nowrap flex-1  rounded-md bg-white px-2 py-1 text-black">
            <div className="flex items-center gap-x-4">
              <input
                type="radio"
                name="background"
                className="radio-primary radio"
                checked={theme === "default"}
                value="default"
                onChange={onThemeChange}
              />
              <p className="text-sm font-semibold">Default</p>
            </div>
          </button>
          <button className="flex h-full w-full whitespace-nowrap flex-1 items-center  rounded-md bg-[#15202B] px-2 py-1 text-white">
            <div className="flex items-center  gap-x-4">
              <input
                type="radio"
                name="background"
                className="radio-primary radio"
                checked={theme === "dim"}
                value="dim"
                onChange={onThemeChange}
              />
              <p className="text-sm font-semibold">Dim</p>
            </div>
          </button>
          <button className="flex h-full w-full whitespace-nowrap flex-1 items-center  rounded-md bg-black px-2 py-1 text-white">
            <div className="flex items-center gap-x-4">
              <input
                type="radio"
                name="background"
                className="radio-primary radio"
                checked={theme === "dark"}
                value="dark"
                onChange={onThemeChange}
              />
              <p className="text-sm font-semibold">Lights out</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundChanger;
