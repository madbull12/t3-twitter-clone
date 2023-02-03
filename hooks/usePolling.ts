import { useEffect, useState } from "react";
import { useChoices, useDisableTweet, useOpenPolling } from "../lib/zustand";
interface Choice {
  choice: string;
}
const usePolling = () => {
//   const [choices, setChoices] = useState<Choice[]>([
//     {
//       choice: "",
//     },
//     {
//       choice: "",
//     },
//   ]);

    const { choices,setChoices } = useChoices()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const updatedState = [...choices];
    updatedState[i] = { choice: e.target.value };

    setChoices(updatedState);
    console.log(choices);
  };
  const { setIsDisabled } = useDisableTweet();

  useEffect(() => {
    if (choices[0]?.choice === "" || choices[1]?.choice === "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [choices]);

  return { choices, handleChange, setChoices };
};

export default usePolling;
