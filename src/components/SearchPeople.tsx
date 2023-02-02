import React, { ChangeEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { BiSearch } from "react-icons/bi";
import { useDebounce } from "usehooks-ts";
import { useDebouncedPeople } from "../../lib/zustand";

const SearchMember = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const router = useRouter();
  const { listId } = router.query
  const [value, setValue] = useState<string>("");
  const { setName } = useDebouncedPeople();
  const debouncedValue = useDebounce<string>(value, 500);
  const { data: members, refetch } =
    trpc.list.searchUserSuggestions.useQuery({ name: debouncedValue,listId:listId as string });
  useEffect(() => {
    // Do fetch here...
    refetch();
    setName(debouncedValue);
  }, [debouncedValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return (
    <form
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`${
        isFocused ? "border-2 border-primary" : null
      } bg- flex w-full items-center gap-x-4 rounded-full px-2 py-1 text-sm text-gray-500 md:px-4 md:py-2 md:text-base`}
    >
      <BiSearch />
      <input
        placeholder="Search people"
        onChange={handleChange}
        type="text"
        className="w-full bg-transparent outline-none"
      />
    </form>
  );
};

export default SearchMember;
